/*
  Create a new NFT Child SLP token. Requires:
  - a wallet created with the create-wallet example.
  - wallet to have a small NFY balance.
  - At least one NFT Group token needs to have been created with the
    create-nft-group example.
*/

import * as bitcoin from 'bitcoinjs-lib';
import CryptoUtil, { NFTChildGenesisOpReturnConfig, WalletInfo } from '../../util';
import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { Network, Transaction } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../../niftycoin/nfy';
import { CryptoLibConfig, SLP } from '../../lib/slp';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// import networks
const mainNet = toBitcoinJS(false);
const testNet = toBitcoinJS(true);

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: NiftyCoinExplorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

const config: CryptoLibConfig = {
  restURL: NETWORK === 'mainnet' ? NFY_MAINNET : NFY_TESTNET
};
const slp = new SLP(config);

export async function createNFTChild(walletInfo: WalletInfo, tokenId: string) {
  try {
    const TOKENID = tokenId;

    const { mnemonic } = walletInfo;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // get the cash address
    // const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    // const slpAddress = CryptoUtil.toSLPAddress(segwitAddress)
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    // Get a UTXO to pay for the transaction.
    const utxos = await explorer.utxo(legacyAddress);
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`);

    if (utxos.length === 0) {
      throw new Error('No UTXOs to pay for transaction! Exiting.');
    }

    // Identify the SLP token UTXOs.
    let tokenUtxos = await slp.Utils.tokenUtxoDetails(utxos);
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    // Filter out the non-SLP token UTXOs.
    const nfyUtxos = utxos.filter((utxo: any, index: number) => {
      const tokenUtxo = tokenUtxos[index];
      if (!tokenUtxo.isValid) return true;
    });
    // console.log(`nfyUTXOs: ${JSON.stringify(nfyUtxos, null, 2)}`);

    if (nfyUtxos.length === 0) {
      throw new Error('Wallet does not have a NFY UTXO to pay miner fees.');
    }

    // Filter out the token UTXOs that match the user-provided token ID
    // and contain the minting baton.
    tokenUtxos = tokenUtxos.filter((utxo: any, index: number) => {
      if (
        utxo && // UTXO is associated with a token.
        utxo.tokenId === TOKENID && // UTXO matches the token ID.
        utxo.utxoType === 'token' // UTXO is not a minting baton.
      ) {
        return true;
      }
    });
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    if (tokenUtxos.length === 0) {
      throw new Error('No token UTXOs for the specified token could be found.');
    }

    // Get the biggest UTXO to pay for the transaction.
    const utxo = CryptoUtil.findBiggestUtxo(utxos);
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`)

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add the NFT Group UTXO as an input. This NFT Group token must be burned
    // to create a Child NFT, as per the spec.
    transactionBuilder.addInput(tokenUtxos[0].tx_hash, tokenUtxos[0].tx_pos);

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // Set the transaction fee. Manually set for ease of example.
    const txFee = 550;

    // amount to send back to the sending address.
    // Subtract two dust transactions for minting baton and tokens.
    const remainder = originalAmount - txFee;

    // Generate SLP config object
    const configObj: NFTChildGenesisOpReturnConfig = {
      name: 'NFT Child',
      ticker: 'NFT004',
      documentUrl: 'https://FullStack.cash'
    };

    // Generate the OP_RETURN entry for an SLP GENESIS transaction.
    const script = slp.NFT1.generateNFTChildGenesisOpReturn(configObj);

    // OP_RETURN needs to be the first output in the transaction.
    transactionBuilder.addOutput(script, 0);

    // Send dust transaction representing the tokens.
    transactionBuilder.addOutput(legacyAddress, 546);

    // Send dust transaction representing minting baton.
    // transactionBuilder.addOutput(
    //   CryptoUtil.toLegacyAddressFromSegWit(segwitAddress),
    //   546
    // );

    // add output to send NFY remainder of UTXO.
    transactionBuilder.addOutput(legacyAddress, remainder);

    // Generate a keypair from the change address.
    const keyPair = change; // not sure if this is the correct to get keypair

    const redeemScript = undefined;

    // Sign the Token UTXO for the NFT Group token that will be burned in this
    // transaction.
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, 546);

    // Sign the input for the UTXO paying for the TX.
    transactionBuilder.sign(1, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)
    // console.log(` `)

    // Broadcast transation to the network
    const txidStr = await explorer.sendRawTransaction(hex);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
    return txidStr;
  } catch (err) {
    console.error('Error in createNFTChild: ', err);
  }
}
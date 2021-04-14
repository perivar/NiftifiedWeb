/*
  Mint a NFT Group tokens.
*/

import * as bitcoin from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../../../util';
import CryptoLib from '../../../lib';
import { NiftyCoinExplorer } from '../../../NiftyCoinExplorer';
import { Network, Transaction } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../../../nifty/nfy';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// import networks
const mainNet = toBitcoinJS(false);
const testNet = toBitcoinJS(true);

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: any;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

export async function mintNFTGroup(walletInfo: WalletInfo) {
  try {
    // EDIT THESE VALUES FOR YOUR USE.
    const TOKENID = 'ba6c400e66190baf7f101c6ea54c0ab81c7fcfa45e9a239088f2ac0a570ec0e5';
    const TOKENQTY = 10; // The quantity of new tokens to mint.
    // const TO_SLPADDR = '' // The address to send the new tokens.

    const { mnemonic } = walletInfo;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // get the segwit address
    // const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    // const slpAddress = CryptoUtil.toSLPAddress(segwitAddress)
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    // Get a UTXO to pay for the transaction.
    const utxos = await explorer.utxo(legacyAddress);
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) {
      throw new Error('No UTXOs to pay for transaction! Exiting.');
    }

    // Identify the SLP token UTXOs.
    let tokenUtxos = await CryptoLib.Utils.tokenUtxoDetails(utxos);
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`)

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
        utxo.utxoType === 'minting-baton' && // UTXO is not a minting baton.
        utxo.tokenType === 129 // UTXO is for NFT Group
      ) {
        return true;
      }
    });
    console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    if (tokenUtxos.length === 0) {
      throw new Error('No token UTXOs for the specified token could be found.');
    }

    // Choose a UTXO to pay for the transaction.
    const utxo = await explorer.findBiggestUtxo(nfyUtxos);
    // console.log(`nfyUtxo: ${JSON.stringify(nfyUtxo, null, 2)}`);

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input to pay for the transaction.
    transactionBuilder.addInput(txid, vout);

    // add the mint baton as an input.
    transactionBuilder.addInput(tokenUtxos[0].tx_hash, tokenUtxos[0].tx_pos);

    // Set the transaction fee. Manually set for ease of example.
    const txFee = 550;

    // amount to send back to the sending address.
    // Subtract two dust transactions for minting baton and tokens.
    const remainder = originalAmount - 546 - txFee;

    // Generate the SLP OP_RETURN.
    const script = CryptoLib.NFT1.mintNFTGroupOpReturn(tokenUtxos, TOKENQTY);

    // OP_RETURN needs to be the first output in the transaction.
    transactionBuilder.addOutput(script, 0);

    // Send dust transaction representing the new tokens.
    transactionBuilder.addOutput(legacyAddress, 546);

    // Send dust transaction representing minting baton.
    transactionBuilder.addOutput(legacyAddress, 546);

    // add output to send NFY remainder of UTXO.
    transactionBuilder.addOutput(legacyAddress, remainder);

    // Generate a keypair from the change address.
    const keyPair = change; // not sure if this is the correct to get keypair

    // Sign the transaction for the UTXO input that pays for the transaction..
    const redeemScript = undefined;
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);

    // Sign the Token UTXO minting baton input
    transactionBuilder.sign(1, keyPair, redeemScript, Transaction.SIGHASH_ALL, 546);

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
  } catch (err) {
    console.error('Error in mintNFTGroup: ', err);
  }
}

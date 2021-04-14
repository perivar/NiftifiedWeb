/*
  Send tokens of type TOKENID to user with SLPADDR address.
*/

import * as bitcoin from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../../util';
import CryptoLib from '../../lib';
import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { Network, Transaction } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../../nifty/nfy';

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

export async function sendToken(walletInfo: WalletInfo) {
  try {
    // CUSTOMIZE THESE VALUES FOR YOUR USE
    const TOKENQTY = 1;
    const TOKENID = '8de4984472af772f144a74de473d6c21505a6d89686b57445c3e4fc7db3773b6';
    let TO_ADDR = '';

    const { mnemonic } = walletInfo;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // Generate an EC key pair for signing the transaction.
    const keyPair = change; // not sure if this is the correct to get keypair

    // get the segwit address
    // const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    // const slpAddress = CryptoUtil.toSLPAddress(change, network);
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    // Get UTXOs held by this address.
    const utxos = await explorer.utxo(legacyAddress);
    console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`);

    if (utxos.length === 0) throw new Error('No UTXOs to spend! Exiting.');

    // Identify the SLP token UTXOs.
    let tokenUtxos = await CryptoLib.Utils.tokenUtxoDetails(utxos);
    console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    // Filter out the non-SLP token UTXOs.
    const nfyUtxos = utxos.filter((utxo: any, index: number) => {
      const tokenUtxo = tokenUtxos[index];
      if (!tokenUtxo.isValid) return true;
    });
    console.log(`nfyUTXOs: ${JSON.stringify(nfyUtxos, null, 2)}`);

    if (nfyUtxos.length === 0) {
      throw new Error('Wallet does not have a NFY UTXO to pay miner fees.');
    }

    // Filter out the token UTXOs that match the user-provided token ID.
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

    // Choose a UTXO to pay for the transaction.
    const nfyUtxo = await explorer.findBiggestUtxo(nfyUtxos);
    // console.log(`nfyUtxo: ${JSON.stringify(nfyUtxo, null, 2)}`);

    // Generate the OP_RETURN code.
    const slpSendObj = CryptoLib.TokenType1.generateSendOpReturn(tokenUtxos, TOKENQTY);
    const slpData = slpSendObj.script;
    // console.log(`slpOutputs: ${slpSendObj.outputs}`);

    // BEGIN transaction construction.

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    // Add the NFY UTXO as input to pay for the transaction.
    const originalAmount = nfyUtxo.value;
    transactionBuilder.addInput(nfyUtxo.tx_hash, nfyUtxo.tx_pos);

    // add each token UTXO as an input.
    for (let i = 0; i < tokenUtxos.length; i++) {
      transactionBuilder.addInput(tokenUtxos[i].tx_hash, tokenUtxos[i].tx_pos);
    }

    // get byte count to calculate fee. paying 1 sat
    // Note: This may not be totally accurate. Just guessing on the byteCount size.
    // const byteCount = this.BITBOX.BitcoinCash.getByteCount(
    //   { P2PKH: 3 },
    //   { P2PKH: 5 }
    // )
    // //console.log(`byteCount: ${byteCount}`)
    // const niftoshisPerByte = 1.1
    // const txFee = Math.floor(niftoshisPerByte * byteCount)
    // console.log(`txFee: ${txFee} niftoshis\n`)
    const txFee = 250;

    // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - txFee - 546 * 2;
    if (remainder < 1) {
      throw new Error('Selected UTXO does not have enough niftoshis');
    }
    // console.log(`remainder: ${remainder}`)

    // Add OP_RETURN as first output.
    transactionBuilder.addOutput(slpData, 0);

    // Send the token back to the same wallet if the user hasn't specified a
    // different address.
    if (TO_ADDR === '') TO_ADDR = walletInfo.legacyAddress;

    // Send dust transaction representing tokens being sent.
    transactionBuilder.addOutput(TO_ADDR, 546);

    // Return any token change back to the sender.
    // TODO: FIX PIN
    // if (slpSendObj.outputs > 1) {
    //   transactionBuilder.addOutput(CryptoUtil.toLegacyAddress(slpAddress), 546);
    // }

    // Last output: send the NFY change back to the wallet.
    transactionBuilder.addOutput(legacyAddress, remainder);

    // Sign the transaction with the private key for the NFY UTXO paying the fees.
    const redeemScript = undefined;
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);

    // Sign each token UTXO being consumed.
    for (let i = 0; i < tokenUtxos.length; i++) {
      const thisUtxo = tokenUtxos[i];

      transactionBuilder.sign(1 + i, keyPair, redeemScript, Transaction.SIGHASH_ALL, thisUtxo.value);
    }

    // build tx
    const tx = transactionBuilder.build();

    // output rawhex
    const hex = tx.toHex();
    // console.log(`Transaction raw hex: `, hex)

    // END transaction construction.

    // Broadcast transation to the network
    const txidStr = await explorer.sendRawTransaction(hex);
    console.log(`Transaction ID: ${txidStr}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.error('Error in sendToken: ', err);
    console.log(`Error message: ${err.message}`);
  }
}

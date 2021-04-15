/*
  Send all NFY from one address to another. Similar to consolidating UTXOs.
*/

import * as bitcoin from 'bitcoinjs-lib';
import { Network, Transaction } from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../util';
import { NiftyCoinExplorer } from '../NiftyCoinExplorer';
import { toBitcoinJS } from '../nifty/nfy';

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

export async function sendAll(walletInfo: WalletInfo) {
  try {
    // The address to send the outputs to.
    let RECV_ADDR = '';

    const SEND_ADDR = walletInfo.legacyAddress;
    const SEND_MNEMONIC = walletInfo.mnemonic;

    // Send the money back to the same address. Edit this if you want to send it
    // somewhere else.
    if (RECV_ADDR === '') RECV_ADDR = walletInfo.segwitAddress;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    let sendAmount = 0;
    const inputs = [];

    const utxos = await explorer.utxo(SEND_ADDR);

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // Loop through each UTXO assigned to this address.
    for (let i = 0; i < utxos.length; i++) {
      const thisUtxo = utxos[i];

      inputs.push(thisUtxo);

      sendAmount += thisUtxo.value;

      // ..Add the utxo as an input to the transaction.
      transactionBuilder.addInput(thisUtxo.tx_hash, thisUtxo.tx_pos);
    }

    // get byte count to calculate fee. paying 1 sat/byte
    const byteCount = CryptoUtil.getByteCount({ P2PKH: inputs.length }, { P2PKH: 1 });
    console.log(`byteCount: ${byteCount}`);

    const niftoshisPerByte = 1.1;
    const txFee = Math.ceil(niftoshisPerByte * byteCount);
    console.log(`txFee: ${txFee}`);

    // Exit if the transaction costs too much to send.
    if (sendAmount - txFee < 0) {
      console.log("Transaction fee costs more combined UTXOs. Can't send transaction.");
      return;
    }

    // add output w/ address and amount to send
    transactionBuilder.addOutput(RECV_ADDR, sendAmount - txFee);

    // Generate a change address from a Mnemonic of a private key.
    const change = await CryptoUtil.changeAddrFromMnemonic(SEND_MNEMONIC, network);

    // Generate a keypair from the change address.
    const keyPair = change; // not sure if this is the correct to get keypair

    // sign w/ HDNode
    const redeemScript = undefined;
    inputs.forEach((input, index) => {
      transactionBuilder.sign(index, keyPair, redeemScript, Transaction.SIGHASH_ALL, input.value);
    });

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)

    // Broadcast transation to the network
    const txid = await explorer.sendRawTransaction(hex);
    console.log(`Transaction ID: ${txid}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txid, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}

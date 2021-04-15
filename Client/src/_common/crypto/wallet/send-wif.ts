/*
  Same as send-nfy example, except this uses a WIF instead of a mnemonic to
  sign the transaction.
  Send 1000 niftoshis to RECV_ADDR_LEGACY.
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

export async function sendWIF(walletInfo: WalletInfo, recvAddrLegacy: string, niftoshisToSend = 1000) {
  try {
    const SEND_ADDR_LEGACY = walletInfo.legacyAddress;
    const SEND_WIF = walletInfo.privateKeyWIF;
    let RECV_ADDR_LEGACY = recvAddrLegacy;

    // If the user fails to specify a reciever address, just send the NFY back
    // to the origination address, so the example doesn't fail.
    if (RECV_ADDR_LEGACY === '') RECV_ADDR_LEGACY = SEND_ADDR_LEGACY;

    // Get the balance of the sending address.
    const balance = await explorer.balance(SEND_ADDR_LEGACY);
    console.log(`balance: ${JSON.stringify(balance, null, 2)}`);
    console.log(`Balance of sending address ${SEND_ADDR_LEGACY} is ${balance} NFY.`);

    // Exit if the balance is zero.
    if (balance <= 0.0) {
      console.log('Balance of sending address is zero. Exiting.');
    }

    console.log(`Sender Legacy Address: ${SEND_ADDR_LEGACY}`);
    console.log(`Receiver Legacy Address: ${RECV_ADDR_LEGACY}`);

    const balance2 = await explorer.balance(RECV_ADDR_LEGACY);
    console.log(`Balance of recieving address ${RECV_ADDR_LEGACY} is ${balance2} NFY.`);

    const utxos = await explorer.utxo(SEND_ADDR_LEGACY);
    // console.log('utxos: ', utxos)

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    const utxo = CryptoUtil.findBiggestUtxo(utxos);
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`)

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // get byte count to calculate fee. paying 1.2 sat/byte
    const byteCount = CryptoUtil.getByteCount({ P2PKH: 1 }, { P2PKH: 2 });
    console.log(`byteCount: ${byteCount}`);
    const niftoshisPerByte = 1.0;
    const txFee = Math.floor(niftoshisPerByte * byteCount);
    // console.log(`txFee: ${txFee}`)

    // amount to send back to the sending address.
    // It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - niftoshisToSend - txFee;

    // add output w/ address and amount to send
    transactionBuilder.addOutput(RECV_ADDR_LEGACY, niftoshisToSend);
    transactionBuilder.addOutput(SEND_ADDR_LEGACY, remainder);

    const keyPair = bitcoin.ECPair.fromWIF(SEND_WIF, network);

    // Sign the transaction with the HD node.
    const redeemScript = undefined;
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);
    // transactionBuilder.sign(0, keyPair);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)

    // Broadcast transation to the network
    const txidStr = await explorer.sendRawTransaction(hex);
    console.log(`Transaction ID: ${txidStr}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
    return txidStr;
  } catch (err) {
    console.log('error: ', err);
  }
}

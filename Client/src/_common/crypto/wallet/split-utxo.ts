/*
  Split the largest UTXO held by the wallet into 5 equally sized UTXOs.
  Useful for avoiding slow indexers and utxo-chain limits.
*/

import * as bitcoin from 'bitcoinjs-lib';
import { Transaction } from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../util';

export async function splitUtxo(walletInfo: WalletInfo, NETWORK = 'mainnet') {
  try {
    const SEND_ADDR = walletInfo.legacyAddress;
    const SEND_MNEMONIC = walletInfo.mnemonic;

    // network
    const electrumx = CryptoUtil.getElectrumX(NETWORK);
    const { network } = electrumx;

    // Get the balance of the sending address.
    const balance = await electrumx.getBalance(SEND_ADDR);

    // Exit if the balance is zero.
    if (balance <= 0.0) {
      console.log('Balance of sending address is zero. Exiting.');
    }

    // Send the NFY back to the same wallet address.
    const RECV_ADDR = SEND_ADDR;

    // Convert to a legacy address (needed to build transactions).
    // const SEND_ADDR_LEGACY = CryptoUtil.toLegacyAddress(SEND_ADDR)
    // const RECV_ADDR_LEGACY = CryptoUtil.toLegacyAddress(RECV_ADDR)

    // Get UTXOs held by the address.
    // https://developer.bitcoin.com/mastering-bitcoin-cash/4-transactions/
    const utxos = await electrumx.getUtxos(SEND_ADDR);
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // console.log(`u: ${JSON.stringify(u, null, 2)}`
    const utxo = CryptoUtil.findBiggestUtxo(utxos);
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    // Essential variables of a transaction.
    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // get byte count to calculate fee. paying 1.2 sat/byte
    const byteCount = CryptoUtil.getByteCount({ P2PKH: 1 }, { P2PKH: 5 });
    console.log(`Transaction byte count: ${byteCount}`);
    const niftoshisPerByte = 1.2;
    const txFee = Math.floor(niftoshisPerByte * byteCount);
    console.log(`Transaction fee: ${txFee}`);

    // Calculate the amount to put into each new UTXO.
    const niftoshisToSend = Math.floor((originalAmount - txFee) / 5);

    if (niftoshisToSend < 546) {
      throw new Error('Not enough NFY to complete transaction!');
    }

    // add outputs w/ address and amount to send
    for (let i = 0; i < 5; i++) {
      transactionBuilder.addOutput(RECV_ADDR, niftoshisToSend);
    }

    // Generate a change address from a Mnemonic of a private key.
    const change = await CryptoUtil.changeAddrFromMnemonic(SEND_MNEMONIC, network);

    // Generate a keypair from the change address.
    const keyPair = change; // not sure if this is the correct to get keypair

    // Sign the transaction with the HD node.
    const redeemScript = undefined;
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)

    // Broadcast transation to the network
    const txidStr = await electrumx.broadcast(hex);

    console.log(`Transaction ID: ${txidStr}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}

/*
  Some applications use dust (547 sats) as a signal on the blockchain. This
  example will generate any number of dust outputs and send them to an address.
*/

import * as bitcoin from 'bitcoinjs-lib';
import { Network, Transaction } from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../util';
import { NiftyCoinExplorer } from '../NiftyCoinExplorer';
import { toBitcoinJS } from '../niftycoin/nfy';

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

export async function sendDust(walletInfo: WalletInfo) {
  try {
    // Set the number of dust outputs to send.
    const NUM_OUTPUTS = 5;

    // The address to send the outputs to.
    let RECV_ADDR = '';

    const SEND_ADDR = walletInfo.legacyAddress;
    const SEND_MNEMONIC = walletInfo.mnemonic;

    // Get the balance of the sending address.
    const balance = await explorer.balance(SEND_ADDR);

    // Exit if the balance is zero.
    if (balance <= 0.0) {
      console.log('Balance of sending address is zero. Exiting.');
    }

    // Send the NFY back to the same wallet address.
    if (RECV_ADDR === '') RECV_ADDR = SEND_ADDR;

    // Convert to a legacy address (needed to build transactions).
    // const SEND_ADDR_LEGACY = CryptoUtil.toLegacyAddress(SEND_ADDR)
    // const RECV_ADDR_LEGACY = CryptoUtil.toLegacyAddress(RECV_ADDR)

    // Get UTXOs held by the address.
    // https://developer.bitcoin.com/mastering-bitcoin-cash/4-transactions/
    const utxos = await explorer.utxo(SEND_ADDR);
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // console.log(`u: ${JSON.stringify(u, null, 2)}`
    const utxo = CryptoUtil.findBiggestUtxo(utxos);
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // Ensure there is enough NFY to generate the desired number of dust.
    const outNFY = 546 * NUM_OUTPUTS + 500;
    if (utxo.value < outNFY) {
      throw new Error('Not enough niftoshis to send desired number of dust outputs.');
    }

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    // Essential variables of a transaction.
    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // get byte count to calculate fee. paying 1.2 sat/byte
    const byteCount = CryptoUtil.getByteCount({ P2PKH: 1 }, { P2PKH: NUM_OUTPUTS + 1 });
    console.log(`Transaction byte count: ${byteCount}`);
    const niftoshisPerByte = 1.2;
    const txFee = Math.floor(niftoshisPerByte * byteCount);
    console.log(`Transaction fee: ${txFee}`);

    // Calculate the amount to put into each new UTXO.
    const changeBch = originalAmount - txFee - NUM_OUTPUTS * 546;

    if (changeBch < 546) {
      throw new Error('Not enough NFY to complete transaction!');
    }

    // add outputs w/ address and amount to send
    for (let i = 0; i < NUM_OUTPUTS; i++) {
      transactionBuilder.addOutput(RECV_ADDR, 546);
    }

    // Add change
    transactionBuilder.addOutput(SEND_ADDR, changeBch);

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
    const txidStr = await explorer.sendRawTransaction(hex);

    console.log(`Transaction ID: ${txidStr}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}
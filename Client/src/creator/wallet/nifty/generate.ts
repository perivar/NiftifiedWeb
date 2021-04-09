import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
import { toBitcoinJS } from './nfy';

const network = toBitcoinJS();

export const generateWallet = () => {
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const publicKey = keyPair.publicKey.toString('hex');
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
  const wif = keyPair.toWIF();
  const privateKey = bitcoin.ECPair.fromWIF(wif, network);
  console.log(`Public: ${publicKey} \nPrivate: ${privateKey} \nAddress: ${address} \nWIF: ${wif}`);
};

const SEND_ADDR = 'NfNPPMJAYqWFHBpVakAaiEJrRB6ohqLi7Y';
const RECV_ADDR = 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg';
const NIFTOSHIS_TO_SEND = 1000;

export const sendTransactions = async (privateKeyWIF: string) => {
  const balanceResult = await axios.get(`http://116.203.83.168:3001/ext/getbalance/${SEND_ADDR}`);
  const balance = balanceResult.data;
  console.log('Source address balance:', balance);

  const transactionResult = await axios.get(`http://116.203.83.168:3001/ext/getaddress/${SEND_ADDR}`);
  const transactions = transactionResult.data;
  console.log('Last txs :', transactions.last_txs.length);

  const latestTx = transactions.last_txs[0].addresses;
  console.log('latest tx address: ', latestTx);

  // everything is in Niftoshis (100 million = 1 Nifty)
  const transactionBuilder = await new bitcoin.TransactionBuilder(network);

  const balanceNifoshis = balance * 100000000;
  const sendAmount = 1 * 100000000;
  const fee = 0.002 * 100000000;
  const whatIsLeft = balanceNifoshis - fee - sendAmount;
  console.log('Send amount:', sendAmount);
  console.log('Fee:', fee);

  transactionBuilder.addInput(latestTx, 1);
  transactionBuilder.addOutput(RECV_ADDR, sendAmount);
  transactionBuilder.addOutput(RECV_ADDR, whatIsLeft);

  const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
  transactionBuilder.sign(0, keyPair);

  const body = transactionBuilder.build().toHex();
  return body;
};

export const sendNiftyCoin = async (privateKeyWIF: string) => {
  try {
    // Get the balance of the sending address.
    const balance = await getNFYBalance(SEND_ADDR, false);
    console.log(`balance: ${JSON.stringify(balance, null, 2)}`);
    console.log(`Balance of sending address ${SEND_ADDR} is ${balance} NFY.`);

    // Exit if the balance is zero.
    if (balance <= 0.0) {
      console.log('Balance of sending address is zero. Exiting.');
      process.exit(0);
    }

    // Convert to a legacy address (needed to build transactions).
    const SEND_ADDR_LEGACY = SEND_ADDR;
    const RECV_ADDR_LEGACY = RECV_ADDR;
    console.log(`Sender Legacy Address: ${SEND_ADDR_LEGACY}`);
    console.log(`Receiver Legacy Address: ${RECV_ADDR_LEGACY}`);

    // Get UTXOs held by the address.
    // https://developer.bitcoin.com/mastering-bitcoin-cash/4-transactions/
    const transactionResult = await axios.get(`http://116.203.83.168:3001/ext/getaddresstxs/${SEND_ADDR}/0/1`);
    const transactions = transactionResult.data;

    if (transactions.length === 0) throw new Error('No transactions found.');

    const utxo = await findUtxo(transactions);
    // const utxo = await findBiggestUtxo(transactions.last_txs);
    // console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    // Essential variables of a transaction.
    // everything is in Niftoshis (100 million = 1 Nifty)
    const satoshisToSend = NIFTOSHIS_TO_SEND;
    const originalAmount = utxo.balance * 100000000;
    const vout = 1;
    const { txid } = utxo;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);
    // txb.addInput(latestTx, 1);

    const txFee = Math.floor(satoshisToSend * 0.01);
    console.log(`Transaction fee: ${txFee}`);

    // amount to send back to the sending address.
    // It's the original amount - 1 sat/byte for tx size
    const remainder = originalAmount - satoshisToSend - txFee;

    if (remainder < 0) {
      throw new Error('Not enough NFY to complete transaction!');
    }

    // add output w/ address and amount to send
    transactionBuilder.addOutput(RECV_ADDR, satoshisToSend);
    transactionBuilder.addOutput(SEND_ADDR, remainder);

    const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);

    transactionBuilder.sign(0, keyPair);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    console.log(`TX hex: ${hex}`);

    // Broadcast transation to the network
    // const txidStr = await bchjs.RawTransactions.sendRawTransaction([hex]);
    // // import from util.js file
    // const util = require('../util.js');
    // console.log(`Transaction ID: ${txidStr}`);
    // console.log('Check the status of your transaction on this block explorer:');
    // util.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
};

// Get the balance in NFY of a NFY address.
async function getNFYBalance(addr: string, verbose: boolean) {
  try {
    const result = await axios.get(`http://116.203.83.168:3001/ext/getbalance/${addr}`);

    if (verbose) console.log(result);

    const balance = Number(result.data);
    return balance;
  } catch (err) {
    console.error('Error in getNFYBalance: ', err);
    console.log(`addr: ${addr}`);
    throw err;
  }
}

async function findUtxo(transactions: any) {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < transactions.length; i++) {
    const tx = transactions[i].txid;

    // Validate the data with the API
    const txout = await axios.get(`http://116.203.83.168:3001/api/getrawtransaction?txid=${tx}&decrypt=1`);

    if (txout === null) {
      // If the UTXO has already been spent, the full node will respond with null.
      console.log('Stale UTXO found. You may need to wait for the indexer to catch up.');
      continue;
    }

    const val = txout.data.vout[0].value;
    if (val > largestAmount) {
      largestAmount = val;
      largestIndex = i;
    }
  }

  return transactions[largestIndex];
}

// Returns the utxo with the biggest balance from an array of utxos.
async function findBiggestUtxo(utxos: any) {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i].addresses;
    // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

    // Validate the data with the API
    const txout = await axios.get(`http://116.203.83.168:3001/api/getrawtransaction?txid=${thisUtxo}&decrypt=1`);

    if (txout === null) {
      // If the UTXO has already been spent, the full node will respond with null.
      console.log('Stale UTXO found. You may need to wait for the indexer to catch up.');
      continue;
    }

    const val = txout.data.vout[0].value;
    if (val > largestAmount) {
      largestAmount = val;
      largestIndex = i;
    }
  }

  return utxos[largestIndex].addresses;
}

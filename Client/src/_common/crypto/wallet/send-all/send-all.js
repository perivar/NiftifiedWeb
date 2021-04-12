/*
  Send all NFY from one address to another. Similar to consolidating UTXOs.
*/

import * as bitcoin from 'bitcoinjs-lib';
import NiftyCoinExplorer from '../../NiftyCoinExplorer';
import * as util from '../../util.js';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// The address to send the outputs to.
let RECV_ADDR = '';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

// Open the wallet generated with create-wallet.
let walletInfo;
try {
  walletInfo = import('../create-wallet/wallet.json');
} catch (err) {
  console.log('Could not open wallet.json. Generate a wallet with create-wallet first.');
  process.exit(0);
}

const SEND_ADDR = walletInfo.cashAddress;
const SEND_MNEMONIC = walletInfo.mnemonic;

// Send the money back to the same address. Edit this if you want to send it
// somewhere else.
if (RECV_ADDR === '') RECV_ADDR = walletInfo.cashAddress;

async function sendAll() {
  try {
    // instance of transaction builder
    let transactionBuilder;
    if (NETWORK === 'mainnet') {
      transactionBuilder = new bitcoin.TransactionBuilder();
    } else transactionBuilder = new bitcoin.TransactionBuilder('testnet');

    let sendAmount = 0;
    const inputs = [];

    let utxos = await explorer.utxo(SEND_ADDR);
    utxos = utxos.utxos;

    // Loop through each UTXO assigned to this address.
    for (let i = 0; i < utxos.length; i++) {
      const thisUtxo = utxos[i];

      inputs.push(thisUtxo);

      sendAmount += thisUtxo.value;

      // ..Add the utxo as an input to the transaction.
      transactionBuilder.addInput(thisUtxo.tx_hash, thisUtxo.tx_pos);
    }

    // get byte count to calculate fee. paying 1 sat/byte
    const byteCount = bitcoin.BitcoinCash.getByteCount({ P2PKH: inputs.length }, { P2PKH: 1 });
    console.log(`byteCount: ${byteCount}`);

    const satoshisPerByte = 1.1;
    const txFee = Math.ceil(satoshisPerByte * byteCount);
    console.log(`txFee: ${txFee}`);

    // Exit if the transaction costs too much to send.
    if (sendAmount - txFee < 0) {
      console.log("Transaction fee costs more combined UTXOs. Can't send transaction.");
      return;
    }

    // add output w/ address and amount to send
    transactionBuilder.addOutput(RECV_ADDR, sendAmount - txFee);

    // Generate a change address from a Mnemonic of a private key.
    const change = await changeAddrFromMnemonic(SEND_MNEMONIC);

    // Generate a keypair from the change address.
    const keyPair = bitcoin.HDNode.toKeyPair(change);

    // sign w/ HDNode
    let redeemScript;
    inputs.forEach((input, index) => {
      transactionBuilder.sign(index, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, input.value);
    });

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)
    console.log(' ');

    // Broadcast transation to the network
    const txid = await bitcoin.RawTransactions.sendRawTransaction([hex]);
    console.log(`Transaction ID: ${txid}`);
    console.log('Check the status of your transaction on this block explorer:');
    util.transactionStatus(txid, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}
sendAll();

// Generate a change address from a Mnemonic of a private key.
async function changeAddrFromMnemonic(mnemonic) {
  try {
    // root seed buffer
    const rootSeed = await bitcoin.Mnemonic.toSeed(mnemonic);

    // master HDNode
    let masterHDNode;
    if (NETWORK === 'mainnet') masterHDNode = bitcoin.HDNode.fromSeed(rootSeed);
    else masterHDNode = bitcoin.HDNode.fromSeed(rootSeed, 'testnet');

    // HDNode of BIP44 account
    const account = bitcoin.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

    // derive the first external change address HDNode which is going to spend utxo
    const change = bitcoin.HDNode.derivePath(account, '0/0');

    return change;
  } catch (err) {
    console.error('Error in changeAddrFromMnemonic()');
    throw err;
  }
}

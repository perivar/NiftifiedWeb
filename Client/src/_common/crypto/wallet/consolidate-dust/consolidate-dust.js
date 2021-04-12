/*
  Consolidate all UTXOs of size 546 sats or smaller into
  a single UTXO.
*/

import * as bitcoin from 'bitcoinjs-lib';
import NiftyCoinExplorer from '../../NiftyCoinExplorer';
import * as util from '../../util.js';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

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

async function consolidateDust() {
  try {
    // instance of transaction builder
    let transactionBuilder;
    if (NETWORK === 'mainnet') {
      transactionBuilder = new bitcoin.TransactionBuilder();
    } else transactionBuilder = new bitcoin.TransactionBuilder('testnet');

    const dust = 546;
    let sendAmount = 0;
    const inputs = [];

    const data = await explorer.utxo(SEND_ADDR);
    const { utxos } = data;

    // Loop through each UTXO assigned to this address.
    for (let i = 0; i < utxos.length; i++) {
      const thisUtxo = utxos[i];

      // If the UTXO is dust...
      if (thisUtxo.value <= dust) {
        inputs.push(thisUtxo);

        sendAmount += thisUtxo.value;

        // ..Add the utxo as an input to the transaction.
        transactionBuilder.addInput(thisUtxo.tx_hash, thisUtxo.tx_pos);
      }
    }

    if (inputs.length === 0) {
      console.log('No dust found in the wallet address.');
      return;
    }

    // get byte count to calculate fee. paying 1.2 sat/byte
    const byteCount = bitcoin.BitcoinCash.getByteCount({ P2PKH: inputs.length }, { P2PKH: 1 });
    console.log(`byteCount: ${byteCount}`);

    const satoshisPerByte = 1.0;
    const txFee = Math.ceil(satoshisPerByte * byteCount);
    console.log(`txFee: ${txFee}`);

    // Exit if the transaction costs too much to send.
    if (sendAmount - txFee < 0) {
      console.log("Transaction fee costs more combined dust. Can't send transaction.");
      return;
    }

    // add output w/ address and amount to send
    transactionBuilder.addOutput(SEND_ADDR, sendAmount - txFee);

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
    const broadcast = await bitcoin.RawTransactions.sendRawTransaction([hex]);
    console.log(`Transaction ID: ${broadcast}`);
    console.log('Check the status of your transaction on this block explorer:');
    util.transactionStatus(broadcast, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}
consolidateDust();

// Generate a change address from a Mnemonic of a private key.
async function changeAddrFromMnemonic(mnemonic) {
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
}

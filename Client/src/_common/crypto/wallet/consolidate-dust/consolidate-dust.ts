/*
  Consolidate all UTXOs of size 546 sats or smaller into
  a single UTXO.
*/

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import CryptoUtil, { WalletInfo } from '../../util';
import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { toBitcoinJS } from '../../nifty/nfy';
import { Network, Transaction } from 'bitcoinjs-lib';

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

export async function consolidateDust(walletInfo: WalletInfo) {
  try {
    const SEND_ADDR = walletInfo.segwitAddress;
    const SEND_MNEMONIC = walletInfo.mnemonic;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    const dust = 546;
    let sendAmount = 0;
    const inputs = [];

    const utxos = await explorer.utxo(SEND_ADDR);

    if (utxos.length === 0) throw new Error('No UTXOs found.');

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
    const byteCount = CryptoUtil.getByteCount({ P2PKH: inputs.length }, { P2PKH: 1 });
    console.log(`byteCount: ${byteCount}`);

    const niftoshisPerByte = 1.0;
    const txFee = Math.ceil(niftoshisPerByte * byteCount);
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
    const keyPair = change.derivePath('0/0'); // not sure if this is the correct to get keypair

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
    const sendRawTransaction = await explorer.sendRawTransaction(hex);
    console.log(`Transaction ID: ${sendRawTransaction}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(sendRawTransaction, NETWORK);
  } catch (err) {
    console.log('error: ', err);
  }
}

// Generate a change address from a Mnemonic of a private key.
async function changeAddrFromMnemonic(mnemonic: string) {
  // root seed buffer
  const rootSeed = await bip39.mnemonicToSeed(mnemonic); // creates seed buffer

  // set network
  let network: Network;
  if (NETWORK === 'mainnet') network = mainNet;
  else network = testNet;

  // master HDNode
  const masterHDNode = bip32.fromSeed(rootSeed, network);

  // HDNode of BIP44 account
  const account = masterHDNode.derivePath("m/44'/145'/0'");

  // derive the first external change address HDNode which is going to spend utxo
  const change = account.derivePath('0/0');

  return change;
}

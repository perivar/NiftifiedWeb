/*
  Some applications use dust (547 sats) as a signal on the blockchain. This
  example will generate any number of dust outputs and send them to an address.
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

export async function sendDust(walletInfo: WalletInfo) {
  try {
    // Set the number of dust outputs to send.
    const NUM_OUTPUTS = 5;

    // The address to send the outputs to.
    let RECV_ADDR = '';

    const SEND_ADDR = walletInfo.segwitAddress;
    const SEND_MNEMONIC = walletInfo.mnemonic;

    // Get the balance of the sending address.
    const balance = await getNFYBalance(SEND_ADDR, false);

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
    const data = await explorer.utxo(SEND_ADDR);
    const { utxos } = data;
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // console.log(`u: ${JSON.stringify(u, null, 2)}`
    const utxo = await findBiggestUtxo(utxos);
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // Ensure there is enough NFY to generate the desired number of dust.
    const outNFY = 546 * NUM_OUTPUTS + 500;
    if (utxo.value < outNFY) {
      throw new Error('Not enough satoshis to send desired number of dust outputs.');
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
    const satoshisPerByte = 1.2;
    const txFee = Math.floor(satoshisPerByte * byteCount);
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
    const change = await changeAddrFromMnemonic(SEND_MNEMONIC);

    // Generate a keypair from the change address.
    const keyPair = change.derivePath('0/0'); // not sure if this is the correct to get keypair

    // Sign the transaction with the HD node.
    const redeemScript = undefined;
    transactionBuilder.sign(0, keyPair, redeemScript, Transaction.SIGHASH_ALL, originalAmount);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)
    console.log(' ');

    // Broadcast transation to the network
    const txidStr = await explorer.broadcast([hex]);

    console.log(`Transaction ID: ${txidStr}`);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
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

// Get the balance in NFY of a NFY address.
async function getNFYBalance(addr: string, verbose: boolean) {
  try {
    const result = await explorer.balance(addr);

    if (verbose) console.log(result);

    const nfyBalance = Number(result);
    return nfyBalance;
  } catch (err) {
    console.error('Error in getNFYBalance: ', err);
    console.log(`addr: ${addr}`);
    throw err;
  }
}

// Returns the utxo with the biggest balance from an array of utxos.
async function findBiggestUtxo(utxos: any) {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i];
    // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

    // Validate the UTXO data with the full node.
    const txout = await explorer.getTxOut(thisUtxo.tx_hash, thisUtxo.tx_pos);
    if (txout === null) {
      // If the UTXO has already been spent, the full node will respond with null.
      console.log('Stale UTXO found. You may need to wait for the indexer to catch up.');
      continue;
    }

    if (thisUtxo.value > largestAmount) {
      largestAmount = thisUtxo.value;
      largestIndex = i;
    }
  }

  return utxos[largestIndex];
}

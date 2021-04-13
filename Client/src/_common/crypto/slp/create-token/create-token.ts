/*
  Create a new SLP token. Requires a wallet created with the create-wallet
  example. Also requires that wallet to have a small NFY balance.
*/

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import CryptoUtil from '../../util';
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

// Open the wallet generated with create-wallet.
let walletInfo: any;
try {
  walletInfo = JSON.parse(window.localStorage.getItem('wallet.json') || '{}');
} catch (err) {
  console.log('Could not open wallet.json. Generate a wallet with create-wallet first.');
}

export async function createToken() {
  try {
    const { mnemonic } = walletInfo;

    // root seed buffer
    const rootSeed = await bip39.mnemonicToSeed(mnemonic); // creates seed buffer

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // master HDNode
    const masterHDNode = bip32.fromSeed(rootSeed, network);

    // HDNode of BIP44 account
    const account = masterHDNode.derivePath("m/44'/245'/0'");

    const change = account.derivePath('0/0');

    // get the cash address
    const cashAddress = CryptoUtil.toCashAddress(change, network);

    // Get a UTXO to pay for the transaction.
    const data = await explorer.utxo(cashAddress);
    const { utxos } = data;
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) {
      throw new Error('No UTXOs to pay for transaction! Exiting.');
    }

    // Get the biggest UTXO to pay for the transaction.
    const utxo = await findBiggestUtxo(utxos);
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // instance of transaction builder
    const transactionBuilder = new bitcoin.TransactionBuilder(network);

    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // Set the transaction fee. Manually set for ease of example.
    const txFee = 550;

    // amount to send back to the sending address.
    // Subtract two dust transactions for minting baton and tokens.
    const remainder = originalAmount - 546 * 2 - txFee;

    // Generate SLP config object
    const configObj = {
      name: 'SLP Test Token',
      ticker: 'SLPTEST',
      documentUrl: 'https://FullStack.cash',
      decimals: 8,
      initialQty: 100,
      documentHash: '',
      mintBatonVout: 2
    };

    // Generate the OP_RETURN entry for an SLP GENESIS transaction.
    const script = CryptoLib.TokenType1.generateGenesisOpReturn(configObj);
    // const data = bitcoin.Script.encode(script)
    // const data = compile(script)

    // OP_RETURN needs to be the first output in the transaction.
    transactionBuilder.addOutput(script, 0);

    // Send dust transaction representing the tokens.
    transactionBuilder.addOutput(CryptoUtil.toLegacyAddressFromString(cashAddress), 546);

    // Send dust transaction representing minting baton.
    transactionBuilder.addOutput(CryptoUtil.toLegacyAddressFromString(cashAddress), 546);

    // add output to send NFY remainder of UTXO.
    transactionBuilder.addOutput(cashAddress, remainder);

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
    // console.log(` `)

    // Broadcast transation to the network
    const txidStr = await explorer.broadcast([hex]);
    console.log('Check the status of your transaction on this block explorer:');
    CryptoUtil.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.error('Error in createToken: ', err);
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

/*
  Convert between address formats
*/

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import CryptoUtil from '../../util';
import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { Network } from 'bitcoinjs-lib';
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

export async function conversion() {
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
    const slpAddress = CryptoUtil.toSLPAddress(change, network);
    const legacyAddress = CryptoUtil.toLegacyAddressFromString(cashAddress);

    console.log(`SLP Address: ${slpAddress}:`);
    console.log(`Cash Address: ${cashAddress}:`);
    console.log(`Legacy Address: ${legacyAddress}:`);
  } catch (err) {
    console.error('Error in conversion: ', err);
    console.log(`Error message: ${err.message}`);
    throw err;
  }
}

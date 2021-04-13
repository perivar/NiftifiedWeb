/*
  Check the NFY and SLP token balances for the wallet created with the
  create-wallet example app.

  TODO:
  - Add diffentiator for TokenType1 vs NFT1.
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

export async function getBalance() {
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

    // first get NFY balance
    const balance = await explorer.balance(cashAddress);

    console.log(`NFY Balance information for ${slpAddress}:`);
    console.log(`${JSON.stringify(balance.balance, null, 2)}`);
    console.log('SLP Token information:');

    // get token balances
    try {
      const tokens = await CryptoLib.Utils.balancesForAddress(slpAddress);

      console.log(JSON.stringify(tokens, null, 2));
    } catch (error) {
      if (error.message === 'Address not found') console.log('No tokens found.');
      else console.log('Error: ', error);
    }
  } catch (err) {
    console.error('Error in getBalance: ', err);
    console.log(`Error message: ${err.message}`);
    throw err;
  }
}

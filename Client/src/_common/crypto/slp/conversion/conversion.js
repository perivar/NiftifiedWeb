/*
  Convert between address formats
*/

import * as bitcoin from 'bitcoinjs-lib';
import NiftyCoinExplorer from '../../NiftyCoinExplorer';

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

async function conversion() {
  try {
    const { mnemonic } = walletInfo;

    // root seed buffer
    const rootSeed = await bitcoin.Mnemonic.toSeed(mnemonic);
    // master HDNode
    let masterHDNode;
    if (NETWORK === 'mainnet') masterHDNode = bitcoin.HDNode.fromSeed(rootSeed);
    else masterHDNode = bitcoin.HDNode.fromSeed(rootSeed, 'testnet'); // Testnet

    // HDNode of BIP44 account
    const account = bitcoin.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");

    const change = bitcoin.HDNode.derivePath(account, '0/0');

    // get the cash address
    const cashAddress = bitcoin.HDNode.toCashAddress(change);
    const slpAddress = bitcoin.SLP.Address.toSLPAddress(cashAddress);
    const legacyAddress = bitcoin.SLP.Address.toLegacyAddress(cashAddress);

    console.log(`SLP Address: ${slpAddress}:`);
    console.log(`Cash Address: ${cashAddress}:`);
    console.log(`Legacy Address: ${legacyAddress}:`);
  } catch (err) {
    console.error('Error in conversion: ', err);
    console.log(`Error message: ${err.message}`);
    throw err;
  }
}
conversion();

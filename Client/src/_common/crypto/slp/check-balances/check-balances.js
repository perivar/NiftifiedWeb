/*
  Check the NFY and SLP token balances for the wallet created with the
  create-wallet example app.

  TODO:
  - Add diffentiator for TokenType1 vs NFT1.
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

async function getBalance() {
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

    // first get NFY balance
    const balance = await explorer.balance(cashAddress);

    console.log(`NFY Balance information for ${slpAddress}:`);
    console.log(`${JSON.stringify(balance.balance, null, 2)}`);
    console.log('SLP Token information:');

    // get token balances
    try {
      const tokens = await bitcoin.SLP.Utils.balancesForAddress(slpAddress);

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
getBalance();

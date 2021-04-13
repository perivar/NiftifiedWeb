/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

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

// Get the balance of the wallet.
export const getBalance = async () => {
  try {
    // first get NFY balance
    const balance = await explorer.balance(walletInfo.legacyAddress);
    console.log('NFY Balance information:');
    console.log(JSON.stringify(balance, null, 2));
  } catch (err) {
    console.error('Error in getBalance: ', err);
    throw err;
  }
};

/*
  Check the balance of the root address of an HD node wallet generated
  with the create-wallet example.
*/

import { NiftyCoinExplorer } from '../NiftyCoinExplorer';
import { WalletInfo } from '../util';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: NiftyCoinExplorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

// Get the balance of the wallet.
export async function getBalance(walletInfo: WalletInfo) {
  try {
    // first get NFY balance
    const balance = await explorer.balance(walletInfo.legacyAddress);
    console.log('NFY Balance information:');
    console.log(JSON.stringify(balance, null, 2));
    return balance;
  } catch (err) {
    console.error('Error in getBalance: ', err);
    throw err;
  }
}

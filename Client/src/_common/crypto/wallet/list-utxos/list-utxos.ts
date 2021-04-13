/*
  List the UTXOs associated with the NFY address in the wallet.
*/

import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { WalletInfo } from '../../util';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: any;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

// Get the balance of the wallet.
export async function listUtxos(walletInfo: WalletInfo) {
  try {
    // first get NFY balance
    const balance = await explorer.utxo(walletInfo.segwitAddress);

    console.log(`UTXOs associated with ${walletInfo.segwitAddress}:`);
    console.log(JSON.stringify(balance, null, 2));
  } catch (err) {
    console.error('Error in listUtxos: ', err);
    throw err;
  }
}

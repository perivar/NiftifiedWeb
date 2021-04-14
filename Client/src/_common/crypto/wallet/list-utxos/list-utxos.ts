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
    const balance = await explorer.balance(walletInfo.legacyAddress);
    console.log(`Balance associated with ${walletInfo.legacyAddress}: ${balance}`);

    // get utxos
    const utxos = await explorer.utxo(walletInfo.legacyAddress);

    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // find biggest
    const utxo = await explorer.findBiggestUtxo(utxos);
    console.log(`UTXOs associated with ${walletInfo.legacyAddress}:`);
    console.log(JSON.stringify(utxo, null, 2));
    return utxo;
  } catch (err) {
    console.error('Error in listUtxos: ', err);
    throw err;
  }
}

/*
  List the UTXOs associated with the NFY address in the wallet.
*/

import { NiftyCoinExplorer } from '../NiftyCoinExplorer';
import { NiftyCoinElectrumX } from '../NiftyCoinElectrumX';
import CryptoUtil, { WalletInfo } from '../util';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: NiftyCoinExplorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

let electrumx: NiftyCoinElectrumX;
if (NETWORK === 'mainnet') electrumx = new NiftyCoinElectrumX({ restURL: 'http://116.203.83.168:50005/' });
else electrumx = new NiftyCoinElectrumX({ restURL: NFY_TESTNET });

// Get the balance of the wallet.
export async function listUtxos(walletInfo: WalletInfo) {
  try {
    // first get NFY balance
    // const balance = await explorer.balance(walletInfo.legacyAddress);
    const balance = await electrumx.getBalance(walletInfo.legacyAddress);
    console.log(`Balance associated with ${walletInfo.legacyAddress}: ${balance}`);

    // get utxos
    // const utxos = await explorer.utxo(walletInfo.legacyAddress);
    const utxos = await electrumx.getUtxos(walletInfo.legacyAddress);
    if (utxos.length === 0) throw new Error('No UTXOs found.');

    // find biggest
    const utxo = CryptoUtil.findBiggestUtxo(utxos);
    // console.log(`UTXOs associated with ${walletInfo.legacyAddress}:`);
    // console.log(JSON.stringify(utxo, null, 2));
    return utxo;
  } catch (err) {
    console.error('Error in listUtxos: ', err);
    throw err;
  }
}

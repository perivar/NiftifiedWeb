/*
  Convert between address formats
*/

import { Network } from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../util';
import { NiftyCoinExplorer } from '../NiftyCoinExplorer';
import { toBitcoinJS } from '../nifty/nfy';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// import networks
const mainNet = toBitcoinJS(false);
const testNet = toBitcoinJS(true);

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer: NiftyCoinExplorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

export async function conversion(walletInfo: WalletInfo) {
  try {
    const { mnemonic } = walletInfo;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // get the segwit address
    const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    const slpAddress = CryptoUtil.toSLPAddress(change, network);
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    console.log(`SLP Address: ${slpAddress}:`);
    console.log(`SegWit Address: ${segwitAddress}:`);
    console.log(`Legacy Address: ${legacyAddress}:`);
  } catch (err) {
    console.error('Error in conversion: ', err);
    console.log(`Error message: ${err.message}`);
    throw err;
  }
}

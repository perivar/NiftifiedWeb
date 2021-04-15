/*
  Check the NFY and SLP token balances for the wallet created with the
  create-wallet example app.

  TODO:
  - Add diffentiator for TokenType1 vs NFT1.
*/

import { Network } from 'bitcoinjs-lib';
import CryptoUtil, { WalletInfo } from '../util';
import CryptoLib from '../lib';
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

export async function getBalance(walletInfo: WalletInfo) {
  try {
    const { mnemonic } = walletInfo;

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // get the segwit address
    // const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    const slpAddress = CryptoUtil.toSLPAddress(change, network);
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    // first get NFY balance
    const balance = await explorer.balance(legacyAddress);

    console.log(`NFY Balance information for ${legacyAddress}:`);
    console.log(`${JSON.stringify(balance, null, 2)}`);
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

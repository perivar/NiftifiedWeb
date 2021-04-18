/*
  Convert between address formats
*/

import CryptoUtil, { WalletInfo } from '../util';

export async function conversion(walletInfo: WalletInfo, NETWORK = 'mainnet') {
  try {
    const { mnemonic } = walletInfo;

    // network
    const network = CryptoUtil.getNetwork(NETWORK);

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

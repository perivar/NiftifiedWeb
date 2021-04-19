/*
  Check the NFY and SLP token balances for the wallet created with the
  create-wallet example app.

  TODO:
  - Add diffentiator for TokenType1 vs NFT1.
*/

import CryptoUtil, { WalletInfo } from '../util';

export async function getBalance(walletInfo: WalletInfo, NETWORK = 'mainnet') {
  try {
    const { mnemonic } = walletInfo;

    // network
    const electrumx = CryptoUtil.getElectrumX(NETWORK);
    const { network } = electrumx;
    const slp = CryptoUtil.getSLP(NETWORK);

    const change = await CryptoUtil.changeAddrFromMnemonic(mnemonic, network);

    // get the segwit address
    // const segwitAddress = CryptoUtil.toSegWitAddress(change, network);
    const legacyAddress = CryptoUtil.toLegacyAddress(change, network);

    // first get NFY balance
    const balance = await electrumx.getBalance(legacyAddress);

    console.log(`NFY Balance information for ${legacyAddress}:`);
    console.log(`${JSON.stringify(balance, null, 2)}`);
    console.log('SLP Token information:');

    // get token balances
    try {
      // PIN: TODO - implement this?
      // const tokens = await slp.Utils.balancesForAddress(slpAddress);
      const tokens = null;
      // console.log(JSON.stringify(tokens, null, 2));
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

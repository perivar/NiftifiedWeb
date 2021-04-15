/*
  Get the token information based on the id.
*/

import { CryptoLibConfig, SLP } from '../lib/slp';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

const config: CryptoLibConfig = {
  restURL: NETWORK === 'mainnet' ? NFY_MAINNET : NFY_TESTNET
};
const slp = new SLP(config);

export async function lookupToken() {
  try {
    // EDIT THIS WITH THE TOKEN ID YOU WANT TO LOOK UP
    const TOKENID = '8de4984472af772f144a74de473d6c21505a6d89686b57445c3e4fc7db3773b6';

    const properties = await slp.Utils.list(TOKENID);
    console.log(properties);
  } catch (err) {
    console.error('Error in getTokenInfo: ', err);
    throw err;
  }
}

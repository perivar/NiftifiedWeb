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

export async function lookupToken(tokenId: string) {
  try {
    const TOKENID = tokenId;

    const properties = await slp.Utils.list(TOKENID);
    console.log(properties);
    return properties;
  } catch (err) {
    console.error('Error in getTokenInfo: ', err);
    throw err;
  }
}

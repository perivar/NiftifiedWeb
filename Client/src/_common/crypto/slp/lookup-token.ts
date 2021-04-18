/*
  Get the token information based on the id.
*/

import CryptoUtil from '../util';

export async function lookupToken(tokenId: string, NETWORK = 'mainnet') {
  try {
    const TOKENID = tokenId;

    // network
    const slp = CryptoUtil.getSLP(NETWORK);

    const properties = await slp.Utils.list(TOKENID);
    console.log(properties);
    return properties;
  } catch (err) {
    console.error('Error in getTokenInfo: ', err);
    throw err;
  }
}

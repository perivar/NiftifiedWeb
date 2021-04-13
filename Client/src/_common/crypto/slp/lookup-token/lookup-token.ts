/*
  Get the token information based on the id.
*/

// EDIT THIS WITH THE TOKEN ID YOU WANT TO LOOK UP
const TOKENID = '8de4984472af772f144a74de473d6c21505a6d89686b57445c3e4fc7db3773b6';

import CryptoLib from '../../lib';

export async function lookupToken() {
  try {
    const properties = await CryptoLib.Utils.list(TOKENID);
    console.log(properties);
  } catch (err) {
    console.error('Error in getTokenInfo: ', err);
    throw err;
  }
}

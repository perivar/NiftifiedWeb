import CryptoUtil from '../../util';

export async function getNFT(tokenId: string, NETWORK = 'mainnet') {
  try {
    // network
    const slp = CryptoUtil.getSLP(NETWORK);

    // decode the OP RETURN information
    const slpData = await slp.Utils.decodeOpReturn(tokenId);
    // console.log(`tokenUtxos: ${JSON.stringify(slpData, null, 2)}`);

    return slpData;
  } catch (err) {
    console.error('Error in getNFT: ', err);
  }
}

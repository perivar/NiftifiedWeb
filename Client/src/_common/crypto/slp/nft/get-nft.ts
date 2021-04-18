import CryptoUtil, { UTXOInfo } from '../../util';

export async function getNFT(tokenId: string, NETWORK = 'mainnet') {
  try {
    const utxos: UTXOInfo[] = [{ value: 0, tx_pos: 2, tx_hash: tokenId }];

    // network
    const slp = CryptoUtil.getSLP(NETWORK);

    // Identify the SLP token UTXOs.
    const tokenUtxos = await slp.Utils.tokenUtxoDetails(utxos);
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    return tokenUtxos[0];
  } catch (err) {
    console.error('Error in getNFT: ', err);
  }
}

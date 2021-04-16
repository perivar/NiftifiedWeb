import * as bitcoin from 'bitcoinjs-lib';
import CryptoUtil, { NFTChildGenesisOpReturnConfig, UTXOInfo, WalletInfo } from '../../util';
import { NiftyCoinExplorer } from '../../NiftyCoinExplorer';
import { Network, Transaction } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../../niftycoin/nfy';
import { CryptoLibConfig, SLP } from '../../lib/slp';

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

const config: CryptoLibConfig = {
  restURL: NETWORK === 'mainnet' ? NFY_MAINNET : NFY_TESTNET
};
const slp = new SLP(config);

export async function getNFT(tokenId: string) {
  try {
    const utxos: UTXOInfo[] = [{ value: 0, tx_pos: 2, tx_hash: tokenId }];

    // Identify the SLP token UTXOs.
    const tokenUtxos = await slp.Utils.tokenUtxoDetails(utxos);
    // console.log(`tokenUtxos: ${JSON.stringify(tokenUtxos, null, 2)}`);

    return tokenUtxos[0];
  } catch (err) {
    console.error('Error in getNFT: ', err);
  }
}

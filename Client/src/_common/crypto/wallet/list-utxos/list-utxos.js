/*
  List the UTXOs associated with the NFY address in the wallet.
*/

import NiftyCoinExplorer from '../../NiftyCoinExplorer';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

// Open the wallet generated with create-wallet.
let walletInfo;
try {
  walletInfo = import('../create-wallet/wallet.json');
} catch (err) {
  console.log('Could not open wallet.json. Generate a wallet with create-wallet first.');
  process.exit(0);
}

// Get the balance of the wallet.
async function listUtxos() {
  try {
    // first get NFY balance
    const balance = await explorer.utxo(walletInfo.cashAddress);

    console.log(`UTXOs associated with ${walletInfo.cashAddress}:`);
    console.log(JSON.stringify(balance, null, 2));
  } catch (err) {
    console.error('Error in listUtxos: ', err);
    throw err;
  }
}
listUtxos();

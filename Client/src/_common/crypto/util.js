/*
utility file for certain .js operations used in applications/wallet
*/

// displays link to either the nfy mainnet or tnfy testnet for transactions
export function transactionStatus(transactionInput, network) {
  if (network === 'mainnet') {
    console.log(`https://explorer.niftycoin.org/ext/gettx/${transactionInput}`);
  } else {
    console.log(`https://testexplorer.niftycoin.org/ext/gettx/${transactionInput}`);
  }
}

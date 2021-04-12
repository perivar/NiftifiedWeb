/*
  Create an HDNode wallet using nfy-js. The mnemonic from this wallet
  will be used in the other examples.
*/

import * as bitcoin from 'bitcoinjs-lib';
import NiftyCoinExplorer from '../../NiftyCoinExplorer';
import { writeFile } from 'fs';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

// Instantiate explorer based on the network.
let explorer;
if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET });
else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET });

async function createWallet() {
  const lang = 'english';
  let outStr = '';
  const outObj = {};

  // create 128 bit BIP39 mnemonic
  const mnemonic = bitcoin.Mnemonic.generate(128, bitcoin.Mnemonic.wordLists()[lang]);
  console.log('BIP44 $NFY Wallet');
  outStr += 'BIP44 $NFY Wallet\n';
  console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);
  outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
  outObj.mnemonic = mnemonic;

  // root seed buffer
  const rootSeed = await bitcoin.Mnemonic.toSeed(mnemonic);

  // master HDNode
  let masterHDNode;
  if (NETWORK === 'mainnet') masterHDNode = bitcoin.HDNode.fromSeed(rootSeed);
  else masterHDNode = bitcoin.HDNode.fromSeed(rootSeed, 'testnet'); // Testnet

  // HDNode of BIP44 account
  const account = bitcoin.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");
  console.log("BIP44 Account: \"m/44'/245'/0'\"");
  outStr += "BIP44 Account: \"m/44'/245'/0'\"\n";

  for (let i = 0; i < 10; i++) {
    const childNode = masterHDNode.derivePath(`m/44'/245'/0'/0/${i}`);
    console.log(`m/44'/245'/0'/0/${i}: ${bitcoin.HDNode.toCashAddress(childNode)}`);
    outStr += `m/44'/245'/0'/0/${i}: ${bitcoin.HDNode.toCashAddress(childNode)}\n`;

    if (i === 0) {
      outObj.cashAddress = bitcoin.HDNode.toCashAddress(childNode);
      outObj.slpAddress = bitcoin.SLP.Address.toSLPAddress(outObj.cashAddress);
      outObj.legacyAddress = bitcoin.Address.toLegacyAddress(outObj.cashAddress);
    }
  }

  // derive the first external change address HDNode which is going to spend utxo
  const change = bitcoin.HDNode.derivePath(account, '0/0');

  // get the cash address
  bitcoin.HDNode.toCashAddress(change);

  // Get the legacy address.

  outStr += '\n\n\n';
  writeFile('wallet-info.txt', outStr, function (err) {
    if (err) return console.error(err);

    console.log('wallet-info.txt written successfully.');
  });

  // Write out the basic information into a json file for other apps to use.
  writeFile('wallet.json', JSON.stringify(outObj, null, 2), function (err) {
    if (err) return console.error(err);
    console.log('wallet.json written successfully.');
  });
}
createWallet();

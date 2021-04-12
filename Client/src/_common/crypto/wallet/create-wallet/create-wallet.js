/*
  Create an HDNode wallet using nfy-js. The mnemonic from this wallet
  will be used by later examples.
*/

import * as bitcoin from 'bitcoinjs-lib';
import { writeFile } from 'fs';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

const lang = 'english'; // Set the language of the wallet.

// These objects used for writing wallet information out to a file.
let outStr = '';
const outObj = {};

async function createWallet() {
  try {
    // create 256 bit BIP39 mnemonic
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
    console.log("BIP44 Account: \"m/44'/145'/0'\"");
    outStr += "BIP44 Account: \"m/44'/145'/0'\"\n";

    // Generate the first 10 seed addresses.
    for (let i = 0; i < 10; i++) {
      const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
      console.log(`m/44'/145'/0'/0/${i}: ${bitcoin.HDNode.toCashAddress(childNode)}`);
      outStr += `m/44'/145'/0'/0/${i}: ${bitcoin.HDNode.toCashAddress(childNode)}\n`;

      // Save the first seed address for use in the .json output file.
      if (i === 0) {
        outObj.cashAddress = bitcoin.HDNode.toCashAddress(childNode);
        outObj.legacyAddress = bitcoin.HDNode.toLegacyAddress(childNode);
        outObj.WIF = bitcoin.HDNode.toWIF(childNode);
      }
    }

    // Write the extended wallet information into a text file.
    writeFile('wallet-info.txt', outStr, function (err) {
      if (err) return console.error(err);

      console.log('wallet-info.txt written successfully.');
    });

    // Write out the basic information into a json file for other example apps to use.
    writeFile('wallet.json', JSON.stringify(outObj, null, 2), function (err) {
      if (err) return console.error(err);
      console.log('wallet.json written successfully.');
    });
  } catch (err) {
    console.error('Error in createWallet(): ', err);
  }
}
createWallet();

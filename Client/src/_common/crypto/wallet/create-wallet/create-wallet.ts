/*
  Create an HDNode wallet using nfy-js. The mnemonic from this wallet
  will be used by later examples.
*/

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Network } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../../nifty/nfy';
import CryptoUtil from '../../util';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// import networks
const mainNet = toBitcoinJS(false);
const testNet = toBitcoinJS(true);

function writeFile(fileName: string, outString: string, handler: Function) {
  window.localStorage.setItem(fileName, outString);
  handler();
}

export const createWallet = async () => {
  try {
    const lang = 'english'; // Set the language of the wallet.

    // These objects used for writing wallet information out to a file.
    let outStr = '';
    const outObj: any = {};

    // create 256 bit BIP39 mnemonic
    const mnemonic = bip39.generateMnemonic();
    console.log('BIP44 NFY Wallet');
    outStr += 'BIP44 NFY Wallet\n';
    console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);
    outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
    outObj.mnemonic = mnemonic;

    // root seed buffer
    const rootSeed = await bip39.mnemonicToSeed(mnemonic); // creates seed buffer

    // set network
    let network: Network;
    if (NETWORK === 'mainnet') network = mainNet;
    else network = testNet;

    // master HDNode
    const masterHDNode = bip32.fromSeed(rootSeed, network);

    // HDNode of BIP44 account
    console.log("BIP44 Account: \"m/44'/145'/0'\"");
    outStr += "BIP44 Account: \"m/44'/145'/0'\"\n";

    // Generate the first 10 seed addresses.
    for (let i = 0; i < 10; i++) {
      const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
      console.log(`m/44'/145'/0'/0/${i}: ${CryptoUtil.toCashAddress(childNode, network)}`);
      outStr += `m/44'/145'/0'/0/${i}: ${CryptoUtil.toCashAddress(childNode, network)}\n`;

      // Save the first seed address for use in the .json output file.
      if (i === 0) {
        outObj.cashAddress = CryptoUtil.toCashAddress(childNode, network);
        outObj.legacyAddress = CryptoUtil.toLegacyAddress(childNode, network);
        outObj.WIF = childNode.toWIF();
      }
    }

    // Write the extended wallet information into a text file.
    writeFile('wallet-info.txt', outStr, (err: any) => {
      if (err) return console.error(err);
      console.log('wallet-info.txt written successfully.');
    });

    // Write out the basic information into a json file for other example apps to use.
    writeFile('wallet.json', JSON.stringify(outObj, null, 2), (err: any) => {
      if (err) return console.error(err);
      console.log('wallet.json written successfully.');
    });
  } catch (err) {
    console.error('Error in createWallet(): ', err);
  }
};

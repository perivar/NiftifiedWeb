/*
  Create an HDNode wallet using nfy-js. The mnemonic from this wallet
  will be used in the other examples.
*/

import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Network } from 'bitcoinjs-lib';
import { toBitcoinJS } from '../niftycoin/nfy';
import CryptoUtil, { WalletInfo } from '../util';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// import networks
const mainNet = toBitcoinJS(false);
const testNet = toBitcoinJS(true);

export const createWallet = async (): Promise<WalletInfo | undefined> => {
  try {
    const lang = 'english';
    // let outStr = '';
    const outObj: WalletInfo = {} as WalletInfo;

    // create 256 bit BIP39 mnemonic
    const mnemonic = bip39.generateMnemonic();
    console.log('BIP44 NFY Wallet');
    // outStr += 'BIP44 NFY Wallet\n';
    console.log(`128 bit ${lang} BIP39 Mnemonic: `, mnemonic);
    // outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
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
    // const account = masterHDNode.derivePath("m/44'/245'/0'");
    console.log("BIP44 Account: \"m/44'/245'/0'\"");
    // outStr += "BIP44 Account: \"m/44'/245'/0'\"\n";

    for (let i = 0; i < 10; i++) {
      const childNode = masterHDNode.derivePath(`m/44'/245'/0'/0/${i}`);
      console.log(`m/44'/245'/0'/0/${i}: ${CryptoUtil.toSegWitAddress(childNode, network)}`);
      // outStr += `m/44'/245'/0'/0/${i}: ${CryptoUtil.toCashAddress(childNode, network)}\n`;

      if (i === 0) {
        outObj.segwitAddress = CryptoUtil.toSegWitAddress(childNode, network);
        outObj.slpAddress = CryptoUtil.toSLPAddress(childNode, network);
        outObj.legacyAddress = CryptoUtil.toLegacyAddress(childNode, network);
        outObj.privateKeyWIF = childNode.toWIF();
      }
    }

    // derive the first external change address HDNode which is going to spend utxo
    // const change = account.derivePath('0/0');

    // get the segwit address
    // const segwitAddress = CryptoUtil.toCashAddress(change, network);

    // outStr += '\n\n\n';
    // writeFile('wallet-info.txt', outStr, (err: any) => {
    //   if (err) return console.error(err);
    //   console.log('wallet-info.txt written successfully.');
    // });

    // // Write out the basic information into a json file for other apps to use.
    // writeFile('wallet.json', JSON.stringify(outObj, null, 2), (err: any) => {
    //   if (err) return console.error(err);
    //   console.log('wallet.json written successfully.');
    // });

    return outObj;
  } catch (err) {
    console.error('Error in createWallet(): ', err);
  }
};

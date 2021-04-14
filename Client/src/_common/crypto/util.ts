/*
utility file for certain .js operations used in applications/wallet
*/

export interface WalletInfo {
  segwitAddress: string;
  legacyAddress: string;
  slpAddress: string;
  WIF: string;
  mnemonic: string;
}

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Network } from 'bitcoinjs-lib';

// displays link to either the nfy mainnet or tnfy testnet for transactions
function transactionStatus(transactionInput: string, network: string) {
  if (network === 'mainnet') {
    console.log(`https://explorer.niftycoin.org/ext/gettx/${transactionInput}`);
  } else {
    console.log(`https://testexplorer.niftycoin.org/ext/gettx/${transactionInput}`);
  }
}

// bchaddrjs-slp
// toLegacyAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk') // 1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR
// toCashAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk
// toSlpAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // simpleledger:qph5kuz78czq00e3t85ugpgd7xmer5kr7ccj3fcpsg

function toSegWitAddress(node: any, network: any): string {
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: node.publicKey, network }),
    network
  });
  return address ? address : '';
}

function toLegacyAddress(node: any, network: any): string {
  const { address } = bitcoin.payments.p2pkh({ pubkey: node.publicKey, network });
  return address ? address : '';
}

function toSLPAddress(node: any, network: any): string {
  // TODO - doesn't do anything yet
  return 'simpleledger:....';
}

const getByteCount = (inputs: any, outputs: any): number => {
  // from https://github.com/bitcoinjs/bitcoinjs-lib/issues/921#issuecomment-354394004
  let totalWeight = 0;
  let hasWitness = false;
  // assumes compressed pubkeys in all cases.
  const types: any = {
    inputs: {
      'MULTISIG-P2SH': 49 * 4,
      'MULTISIG-P2WSH': 6 + 41 * 4,
      'MULTISIG-P2SH-P2WSH': 6 + 76 * 4,
      P2PKH: 148 * 4,
      P2WPKH: 108 + 41 * 4,
      'P2SH-P2WPKH': 108 + 64 * 4
    },
    outputs: {
      P2SH: 32 * 4,
      P2PKH: 34 * 4,
      P2WPKH: 31 * 4,
      P2WSH: 43 * 4
    }
  };

  Object.keys(inputs).forEach(function (key) {
    if (key.slice(0, 8) === 'MULTISIG') {
      // ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
      const keyParts = key.split(':');
      if (keyParts.length !== 2) throw new Error(`invalid input: ${key}`);
      const newKey = keyParts[0];
      const mAndN = keyParts[1].split('-').map(function (item) {
        return parseInt(item);
      });

      totalWeight += types.inputs[newKey] * inputs[key];
      const multiplyer = newKey === 'MULTISIG-P2SH' ? 4 : 1;
      totalWeight += (73 * mAndN[0] + 34 * mAndN[1]) * multiplyer;
    } else {
      totalWeight += types.inputs[key] * inputs[key];
    }
    if (key.indexOf('W') >= 0) hasWitness = true;
  });

  Object.keys(outputs).forEach(function (key) {
    totalWeight += types.outputs[key] * outputs[key];
  });

  if (hasWitness) totalWeight += 2;

  totalWeight += 10 * 4;

  return Math.ceil(totalWeight / 4);
};

// Generate a change address from a Mnemonic of a private key.
async function changeAddrFromMnemonic(mnemonic: string, network: Network) {
  // root seed buffer
  const rootSeed = await bip39.mnemonicToSeed(mnemonic); // creates seed buffer

  // master HDNode
  const masterHDNode = bip32.fromSeed(rootSeed, network);

  // HDNode of BIP44 account
  const account = masterHDNode.derivePath("m/44'/145'/0'");

  // derive the first external change address HDNode which is going to spend utxo
  const change = account.derivePath('0/0');

  return change;
}

const CryptoUtil = {
  transactionStatus,
  toSegWitAddress,
  toLegacyAddress,
  toSLPAddress,
  getByteCount,
  changeAddrFromMnemonic
};

export default CryptoUtil;

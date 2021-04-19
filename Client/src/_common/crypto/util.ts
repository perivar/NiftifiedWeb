/*
utility file for certain .js operations used in applications/wallet
*/

import * as bitcoin from 'bitcoinjs-lib';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32';
import { Network } from 'bitcoinjs-lib';
import { toBitcoinJS } from './niftycoin/nfy';
import { NiftyCoinExplorer } from './NiftyCoinExplorer';
import { NiftyCoinElectrumX } from './NiftyCoinElectrumX';
import { CryptoLibConfig, SLP } from './lib/slp';

export interface WalletInfo {
  hdNodePath: string;
  segwitAddress: string;
  legacyAddress: string;
  slpAddress?: string;
  mnemonic: string;

  // from original wallet interface
  privateKey: string;
  publicKey: string;
  privateKeyWIF: string;
}

export interface UTXOInfo {
  value: number; // in niftoshis
  tx_pos: number;
  tx_hash: string;
}

export interface TokenUTXOInfo extends UTXOInfo {
  txid: string;
  vout: any;
  transactionType: string;

  // token
  mintBatonVout: number | null;
  isValid: boolean | null;
  tokenType: string;
  utxoType: string;
  tokenQty: any; // number and string?
  tokenId: string;
  tokenTicker: string;
  tokenName: string;
  tokenDocumentUrl: string;
  tokenDocumentHash: string;
  decimals: number;
}

export interface SlpToken {
  tokenType: string;
  txType: string;
  tokenId: string;
}

export interface SlpTokenGenesis extends SlpToken {
  ticker: string;
  name: string;
  documentUri: string;
  documentHash: string;
  decimals: number;
  mintBatonVout: number | null;
  qty: string;
}

export interface SlpTokenMint extends SlpToken {
  mintBatonVout: number | null;
  qty: string;
}

export interface SlpTokenSend extends SlpToken {
  amounts: string;
}

export type SlpTokenData = SlpTokenGenesis | SlpTokenMint | SlpTokenSend;

export interface NFTGroupOpReturnConfig {
  documentHash?: string;
  mintBatonVout?: number | null;
  ticker: string;
  name: string;
  documentUrl: string;
  initialQty: number;
}

export interface SLPGenesisOpReturnConfig {
  documentHash?: string;
  mintBatonVout?: number | null;
  ticker: string;
  name: string;
  documentUrl: string;
  initialQty: number;
  decimals: number;
}

export interface NFTChildGenesisOpReturnConfig {
  documentHash?: string;
  mintBatonVout?: number | null;
  ticker: string;
  name: string;
  documentUrl: string;
}

// see slp types here from https://github.com/simpleledger/slpjs/blob/master/lib/slp.ts

// displays link to either the nfy mainnet or tnfy testnet for transactions
function transactionStatus(transactionInput: string, network: string) {
  if (network === 'mainnet') {
    // console.log(`https://explorer.niftycoin.org/api/getrawtransaction?txid=${transactionInput}&decrypt=1`);
    console.log(`https://explorer.niftycoin.org/tx/${transactionInput}`);
  } else {
    // console.log(`https://testexplorer.niftycoin.org/api/getrawtransaction?txid=${transactionInput}&decrypt=1`);
    console.log(`https://testexplorer.niftycoin.org/tx/${transactionInput}`);
  }
}

// bchaddrjs-slp
// toLegacyAddress('qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk') // 1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR
// toCashAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // bitcoincash:qph5kuz78czq00e3t85ugpgd7xmer5kr7c5f6jdpwk
// toSlpAddress('1B9UNtBfkkpgt8kVbwLN9ktE62QKnMbDzR') // simpleledger:qph5kuz78czq00e3t85ugpgd7xmer5kr7ccj3fcpsg

function toSegWitAddress(keyPair: any, network: any): string {
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network }),
    network
  });
  return address ? address : '';
}

function toLegacyAddress(keyPair: any, network: any): string {
  const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
  return address ? address : '';
}

function toKeyPairFromWIF(privateKeyWIF: string, network: any): any {
  const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
  return keyPair;
}

function toPublicKey(keyPair: any): string {
  const publicKey = keyPair.publicKey.toString('hex');
  return publicKey ? publicKey : '';
}

function toPrivateKeyFromWIF(privateKeyWIF: string, network: any): string {
  const keyPair = toKeyPairFromWIF(privateKeyWIF, network);
  const privateKey = keyPair.privateKey.toString('hex');
  return privateKey ? privateKey : '';
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

// Returns the utxo with the biggest balance from an array of utxos.
function findBiggestUtxo(utxos: UTXOInfo[]): UTXOInfo {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i];
    // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

    // TODO: Validate the UTXO data with the full node and check if it has been spent?

    if (thisUtxo.value > largestAmount) {
      largestAmount = thisUtxo.value;
      largestIndex = i;
    }
  }

  // lookup
  const found = utxos[largestIndex];
  return found;
}

// Returns true if user-provided cash address matches the correct network,
// mainnet or testnet. If NETWORK env var is not defined, it returns false.
// This prevent a common user-error issue that is easy to make: passing a
// testnet address into rest.bitcoin.com or passing a mainnet address into
// trest.bitcoin.com.
function validateNetwork(addr: string) {
  try {
    // const network = process.env.NETWORK;

    // Return false if NETWORK is not defined.
    // if (!network || network === '') {
    //   console.log('Warning: NETWORK environment variable is not defined!');
    //   return false;
    // }

    // // Convert the user-provided address to a cashaddress, for easy detection
    // // of the intended network.
    // const cashAddr = this.bchjs.Address.toCashAddress(addr);

    // // Return true if the network and address both match testnet
    // const addrIsTest = this.bchjs.Address.isTestnetAddress(cashAddr);
    // if (network === 'testnet' && addrIsTest) return true;

    // // Return true if the network and address both match mainnet
    // const addrIsMain = this.bchjs.Address.isMainnetAddress(cashAddr);
    // if (network === 'mainnet' && addrIsMain) return true;

    // disabled for now
    return true;
    // return false;
  } catch (err) {
    console.log('Error in validateNetwork()');
    return false;
  }
}

// Error messages returned by a full node can be burried pretty deep inside the
// error object returned by Axios. This function attempts to extract and interpret
// error messages.
// Returns an object. If successful, obj.msg is a string.
// If there is a failure, obj.msg is false.
function decodeError(err: any) {
  try {
    // Attempt to extract the full node error message.
    if (err.response && err.response.data && err.response.data.error && err.response.data.error.message) {
      return { msg: err.response.data.error.message, status: 400 };
    }

    // Attempt to extract the Insight error message
    if (err.response && err.response.data) {
      return { msg: err.response.data, status: err.response.status };
    }

    // console.log(`err.message: ${err.message}`)
    // console.log(`err: `, err)

    // Attempt to detect a network connection error.
    if (err.message && err.message.indexOf('ENOTFOUND') > -1) {
      return {
        msg: 'Network error: Could not communicate with full node or other external service.',
        status: 503
      };
    }

    // Different kind of network error
    if (err.message && err.message.indexOf('ENETUNREACH') > -1) {
      return {
        msg: 'Network error: Could not communicate with full node or other external service.',
        status: 503
      };
    }

    // Different kind of network error
    if (err.message && err.message.indexOf('EAI_AGAIN') > -1) {
      return {
        msg: 'Network error: Could not communicate with full node or other external service.',
        status: 503
      };
    }

    // Axios timeout (aborted) error, or service is down (connection refused).
    if (err.code && (err.code === 'ECONNABORTED' || err.code === 'ECONNREFUSED')) {
      return {
        msg: 'Network error: Could not communicate with full node or other external service.',
        status: 503
      };
    }

    return { msg: false, status: 500 };
  } catch (err) {
    console.log('unhandled error in route-utils.js/decodeError(): ', err);
    return { msg: false, status: 500 };
  }
}

function getNetwork(NETWORK = 'mainnet') {
  // import networks
  const mainNet = toBitcoinJS(false);
  const testNet = toBitcoinJS(true);

  // set network
  let network: Network;
  if (NETWORK === 'mainnet') network = mainNet;
  else network = testNet;

  return network;
}

function getExplorer(NETWORK = 'mainnet') {
  const network = getNetwork(NETWORK);

  // REST API servers.
  const NFY_MAINNET = 'https://explorer.niftycoin.org/';
  const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

  // Instantiate explorer based on the network.
  let explorer: NiftyCoinExplorer;
  if (NETWORK === 'mainnet') explorer = new NiftyCoinExplorer({ restURL: NFY_MAINNET, network });
  else explorer = new NiftyCoinExplorer({ restURL: NFY_TESTNET, network });

  return explorer;
}

function getElectrumX(NETWORK = 'mainnet') {
  const network = getNetwork(NETWORK);

  // REST API servers.
  const NFY_MAINNET = 'http://116.203.83.168:50005/';
  const NFY_TESTNET = 'http://116.203.83.168:50006/';

  let electrumx: NiftyCoinElectrumX;
  if (NETWORK === 'mainnet') electrumx = new NiftyCoinElectrumX({ restURL: NFY_MAINNET, network });
  else electrumx = new NiftyCoinElectrumX({ restURL: NFY_TESTNET, network });

  return electrumx;
}

function getSLP(NETWORK = 'mainnet') {
  // REST API servers.
  const NFY_MAINNET = 'https://explorer.niftycoin.org/';
  const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

  const explorer = getExplorer(NETWORK);
  const electrumx = getElectrumX(NETWORK);

  const config: CryptoLibConfig = {
    restURL: NETWORK === 'mainnet' ? NFY_MAINNET : NFY_TESTNET,
    explorer,
    electrumx
  };
  const slp = new SLP(config);

  return slp;
}

const CryptoUtil = {
  transactionStatus,
  toSegWitAddress,
  toLegacyAddress,
  getByteCount,
  changeAddrFromMnemonic,
  findBiggestUtxo,
  toPublicKey,
  toPrivateKeyFromWIF,
  toKeyPairFromWIF,
  validateNetwork,
  decodeError,
  getNetwork,
  getExplorer,
  getElectrumX,
  getSLP
};

export default CryptoUtil;

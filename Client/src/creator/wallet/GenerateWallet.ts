// for generating wallet
// check https://gist.github.com/tgoldenberg/f5f50386f4a47a6de817610e662bcb2e
import base58 from 'bs58';
import { ec } from 'elliptic';
import ripemd160 from 'ripemd160';
import secureRandom from 'secure-random';
import { sha256 } from 'js-sha256';

const ecdsa = new ec('secp256k1');

// Convert a hex string to a byte array
export const hexToBytes = (hex: string): number[] => {
  const bytes = [];
  for (let c = 0; c < hex.length; c += 2) bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
};

// Convert a byte array to a hex string
export const bytesToHex = (bytes: number[]): string => {
  const hex = [];
  for (let i = 0; i < bytes.length; i++) {
    const current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16).toUpperCase());
    hex.push((current & 0xf).toString(16).toUpperCase());
  }
  return hex.join('');
};

/**
 * hash with both SHA-256 and RIPEMD-160 algorithms
 *
 * @param {String} msg
 */
export const HASH160 = (msg: string) => {
  const hash = sha256(Buffer.from(msg, 'hex'));
  return new ripemd160().update(Buffer.from(hash, 'hex')).digest();
};

/**
 * get a base58 encoded address given a user's public key
 *
 * @param {String} publicKey
 */
export const getAddress = (publicKey: string) => {
  // generate public key hash
  const publicKeyHash = HASH160(publicKey);
  console.log('> Public key hash created: ', publicKeyHash.toString('hex'));

  // generate public address
  const publicAddress = getPublicAddress(publicKeyHash.toString('hex'));
  console.log('> Public address created: ', publicAddress);

  return publicAddress;
};

/**
 * get a private WIF key based on the private key in hex
 *
 * @param {String} privateKey
 */
export const getPrivateKeyWIF = (privateKey: string) => {
  // step 1 - add prefix "35" in hex (0x35 for niftycoin, 0x80 for bitcoin, 0xB0 for litecoin)
  // base58Prefixes[SECRET_KEY]
  const step1 = Buffer.from(`35${privateKey}`, 'hex');
  // step 2 - create SHA256 hash of step 1
  const step2 = sha256(step1);
  // step 3 - create SHA256 hash of step 2
  const step3 = sha256(Buffer.from(step2, 'hex'));
  // step 4 - find the 1st byte of step 3 - save as "checksum"
  const checksum = step3.substring(0, 8);
  // step 5 - add step 1 + checksum
  const step4 = step1.toString('hex') + checksum;
  // return base 58 encoding of step 5
  const privateKeyWIF = base58.encode(Buffer.from(step4, 'hex'));
  return privateKeyWIF;
};

/**
 * Create a private key in hex based on the private WIF key
 *
 * @param {String} privateKeyWIF
 */
export const getPrivateKey = (privateKeyWIF: string) => {
  const step1 = base58.decode(privateKeyWIF);
  const step2 = step1.toString('hex').toUpperCase();
  // TODO how to check that the checksum is OK?
  // for now remove the network byte and the checksum
  // console.log(`base58 nocheck: ${step2}`);
  const networkByte = step2.substring(0, 2);
  const checksum = step2.substring(66, 74);
  const privateKey = step2.substring(2, 66);
  // console.log(`networkByte: ${networkByte}`);
  // console.log(`checksum: ${checksum}`);
  return privateKey;
};

/**
 * Create a public address based on the hash
 *
 * @param {String} publicKeyHash
 */
export const getPublicAddress = (publicKeyHash: string) => {
  // step 1 - add prefix "35" in hex (0x35 for niftycoin, 0x00 for bitcoin, 0x30 for litecoin)
  // base58Prefixes[PUBKEY_ADDRESS]
  const step1 = Buffer.from(`35${publicKeyHash}`, 'hex');
  // step 2 - create SHA256 hash of step 1
  const step2 = sha256(step1);
  // step 3 - create SHA256 hash of step 2
  const step3 = sha256(Buffer.from(step2, 'hex'));
  // step 4 - find the 1st byte of step 3 - save as "checksum"
  const checksum = step3.substring(0, 8);
  // step 5 - add step 1 + checksum
  const step4 = step1.toString('hex') + checksum;
  // return base 58 encoding of step 5
  const address = base58.encode(Buffer.from(step4, 'hex'));
  return address;
};

/**
 * Generate a private key in hex
 *
 */
export const generatePrivateKey = (): Buffer => {
  // https://en.bitcoin.it/wiki/Secp256k1
  // the key needs to be in the range 1 - curve order
  // the curve order for secp256k1 curve is
  // FFFFFFFF FFFFFFFF FFFFFFFF FFFFFFFE BAAEDCE6 AF48A03B BFD25E8C D0364141
  const maxArr = hexToBytes('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140');
  const max = Buffer.from(maxArr);
  // console.log('> Private key max : ', max.toString('hex')); // convert to hexadecimal

  let isInvalid = true;
  let privateKey = Buffer.allocUnsafe(0);
  while (isInvalid) {
    privateKey = secureRandom.randomBuffer(32); // 32 byte random number
    console.log('> Private key created: ', privateKey.toString('hex')); // convert to hexadecimal
    if (Buffer.compare(max, privateKey) === 1) {
      isInvalid = false;
    }
  }
  return privateKey;
};

/**
 * get a public key based on the private key buffer
 *
 * @param {Buffer | string} privateKey
 */
export const getPublicKey = (privateKey: Buffer | string) => {
  // generate public key from private
  const keys = ecdsa.keyFromPrivate(privateKey);
  const publicKey = keys.getPublic('hex').toUpperCase();
  return publicKey;
};

/**
 * Generate a full wallet
 *
 */
export const makeWallet = () => {
  const privateKey = generatePrivateKey();

  // generate public key from private
  const publicKey = getPublicKey(privateKey);
  console.log('> Public key created: ', publicKey);

  // generate public key hash
  const publicKeyHash = HASH160(publicKey);
  console.log('> Public key hash created: ', publicKeyHash.toString('hex'));

  // generate public address
  const publicAddress = getPublicAddress(publicKeyHash.toString('hex'));
  console.log('> Public address created: ', publicAddress);

  // generate private key WIF (wallet import format)
  const privateKeyWIF = getPrivateKeyWIF(privateKey.toString('hex'));
  console.log('> Private key WIF (wallet import format) created : ', privateKeyWIF);

  const wallet = {
    privateKey: privateKey.toString('hex').toUpperCase(),
    publicKey,
    publicKeyHash: publicKeyHash.toString('hex').toUpperCase(),
    privateKeyWIF,
    publicAddress
  };
  return wallet;
};

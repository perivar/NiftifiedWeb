/*
  Create a new SLP token. Requires a wallet created with the create-wallet
  example. Also requires that wallet to have a small NFY balance.
*/

import * as bitcoin from 'bitcoinjs-lib';
import NiftyCoinExplorer from '../../NiftyCoinExplorer';
import * as util from '../../util.js';

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

async function createToken() {
  try {
    const { mnemonic } = walletInfo;

    // root seed buffer
    const rootSeed = await bitcoin.Mnemonic.toSeed(mnemonic);
    // master HDNode
    let masterHDNode;
    if (NETWORK === 'mainnet') masterHDNode = bitcoin.HDNode.fromSeed(rootSeed);
    else masterHDNode = bitcoin.HDNode.fromSeed(rootSeed, 'testnet'); // Testnet

    // HDNode of BIP44 account
    const account = bitcoin.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");

    const change = bitcoin.HDNode.derivePath(account, '0/0');

    // get the cash address
    const cashAddress = bitcoin.HDNode.toCashAddress(change);
    // const slpAddress = bitcoin.SLP.Address.toSLPAddress(cashAddress)

    // Get a UTXO to pay for the transaction.
    const data = await explorer.utxo(cashAddress);
    const { utxos } = data;
    // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

    if (utxos.length === 0) {
      throw new Error('No UTXOs to pay for transaction! Exiting.');
    }

    // Get the biggest UTXO to pay for the transaction.
    const utxo = await findBiggestUtxo(utxos);
    console.log(`utxo: ${JSON.stringify(utxo, null, 2)}`);

    // instance of transaction builder
    let transactionBuilder;
    if (NETWORK === 'mainnet') {
      transactionBuilder = new bitcoin.TransactionBuilder();
    } else transactionBuilder = new bitcoin.TransactionBuilder('testnet');

    const originalAmount = utxo.value;
    const vout = utxo.tx_pos;
    const txid = utxo.tx_hash;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // Set the transaction fee. Manually set for ease of example.
    const txFee = 550;

    // amount to send back to the sending address.
    // Subtract two dust transactions for minting baton and tokens.
    const remainder = originalAmount - 546 * 2 - txFee;

    // Generate SLP config object
    const configObj = {
      name: 'SLP Test Token',
      ticker: 'SLPTEST',
      documentUrl: 'https://FullStack.cash',
      decimals: 8,
      initialQty: 100,
      documentHash: '',
      mintBatonVout: 2
    };

    // Generate the OP_RETURN entry for an SLP GENESIS transaction.
    const script = bitcoin.SLP.TokenType1.generateGenesisOpReturn(configObj);
    // const data = bitcoin.Script.encode(script)
    // const data = compile(script)

    // OP_RETURN needs to be the first output in the transaction.
    transactionBuilder.addOutput(script, 0);

    // Send dust transaction representing the tokens.
    transactionBuilder.addOutput(bitcoin.Address.toLegacyAddress(cashAddress), 546);

    // Send dust transaction representing minting baton.
    transactionBuilder.addOutput(bitcoin.Address.toLegacyAddress(cashAddress), 546);

    // add output to send NFY remainder of UTXO.
    transactionBuilder.addOutput(cashAddress, remainder);

    // Generate a keypair from the change address.
    const keyPair = bitcoin.HDNode.toKeyPair(change);

    // Sign the transaction with the HD node.
    let redeemScript;
    transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, originalAmount);

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();
    // console.log(`TX hex: ${hex}`)
    // console.log(` `)

    // Broadcast transation to the network
    const txidStr = await bitcoin.RawTransactions.sendRawTransaction([hex]);
    console.log('Check the status of your transaction on this block explorer:');
    util.transactionStatus(txidStr, NETWORK);
  } catch (err) {
    console.error('Error in createToken: ', err);
  }
}
createToken();

// Returns the utxo with the biggest balance from an array of utxos.
async function findBiggestUtxo(utxos) {
  let largestAmount = 0;
  let largestIndex = 0;

  for (let i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i];
    // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

    // Validate the UTXO data with the full node.
    const txout = await bitcoin.Blockchain.getTxOut(thisUtxo.tx_hash, thisUtxo.tx_pos);
    if (txout === null) {
      // If the UTXO has already been spent, the full node will respond with null.
      console.log('Stale UTXO found. You may need to wait for the indexer to catch up.');
      continue;
    }

    if (thisUtxo.value > largestAmount) {
      largestAmount = thisUtxo.value;
      largestIndex = i;
    }
  }

  return utxos[largestIndex];
}

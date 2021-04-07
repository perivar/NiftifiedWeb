import bitcoin, { networks } from 'bitcoinjs-lib';
import axios from 'axios';
import { toBitcoinJS } from './nfy';

const network = toBitcoinJS();

export const generateWallet = () => {
  const keyPair = bitcoin.ECPair.makeRandom({ network });
  const publicKey = keyPair.publicKey.toString('hex');
  const address = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network });
  const wif = keyPair.toWIF();
  const privateKey = bitcoin.ECPair.fromWIF(wif, network);
  console.log(`Public: ${publicKey} \nPrivate: ${privateKey} \nAddress: ${address} \nWIF: ${wif}`);
};

export const sendTransactions = async (privateKeyWIF: string) => {
  const source = {
    public: '<pub_key>',
    address: 'NfNPPMJAYqWFHBpVakAaiEJrRB6ohqLi7Y',
    wif: '<wif>',
    dest: '<dest_addr>'
  };

  const destination = {
    address: 'sss'
  };

  const result = await axios.get(`http://116.203.83.168:3001/ext/getbalance/${source.address}`);
  const balance = result.data.final_balance;
  console.log('Source address balance:', balance);

  const latestTx = result.data.txs[0].hash;
  console.log('latest tx: ', latestTx);

  // everything is in Niftoshis (100 million = 1 Nifty)
  const txb = new bitcoin.TransactionBuilder(network);

  const sendAmount = 1 * 100000000;
  const fee = 0.002 * 100000000;
  const whatIsLeft = balance - fee - sendAmount;
  console.log('Send amount:', sendAmount);
  console.log('Fee:', fee);

  txb.addInput(latestTx, 1);
  txb.addOutput(destination.address, sendAmount);
  txb.addOutput(destination.address, whatIsLeft);

  const keyPair = bitcoin.ECPair.fromWIF(privateKeyWIF, network);
  txb.sign(0, keyPair);

  const body = txb.build().toHex();
  console.log(body);

  // get balance of a wallet
  // request.get(`${rootUrl}/addrs/${source.address}/balance`, (error, response, body) => {
  //   if (body.error || JSON.parse(body).errors) {
  //     if (body.error) console.log(body.error);
  //     else console.log(JSON.parse(body).errors[0].error);
  //   } else {
  //     console.log(body);
  //     const parsed_body = JSON.parse(body);
  //     let { balance } = parsed_body;
  //     const { unconfirmed_balance } = parsed_body;
  //     if (unconfirmed_balance < 0) balance = balance + unconfirmed_balance;
  //     console.log(`balance : ${balance}`);
  //   }
  // });
};

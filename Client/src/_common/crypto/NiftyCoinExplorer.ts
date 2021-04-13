/*
  This library interacts with the NiftyCoin Explorer REST API endpoints
*/
// Public npm libraries
import axios, { AxiosRequestConfig } from 'axios';

let _this: NiftyCoinExplorer;

export class NiftyCoinExplorer {
  restURL: string;
  apiToken: string;
  authToken: string;
  axiosOptions: AxiosRequestConfig;

  constructor(config: any) {
    this.restURL = config.restURL;
    this.apiToken = config.apiToken;
    this.authToken = config.authToken;

    if (this.authToken) {
      // Add Basic Authentication token to the authorization header.
      this.axiosOptions = {
        headers: {
          authorization: this.authToken
        }
      };
    } else if (this.apiToken) {
      // Add JWT token to the authorization header.
      this.axiosOptions = {
        headers: {
          authorization: `Token ${this.apiToken}`
        }
      };
    } else {
      this.axiosOptions = {};
    }

    _this = this;
  }

  async utxo(address: string | string[]) {
    try {
      // Handle single address.
      if (typeof address === 'string') {
        const response = await axios.get(`${this.restURL}ext/getaddresstxs/${address}/0/10`, _this.axiosOptions);
        return response.data;

        // Handle array of addresses.
        // } else if (Array.isArray(address)) {
        //   const response = await axios.post(
        //     `${this.restURL}electrumx/utxos`,
        //     {
        //       addresses: address
        //     },
        //     _this.axiosOptions
        //   );

        //   return response.data;
      }

      throw new Error('Input address must be a string or array of strings.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  async balance(address: string | string[]) {
    try {
      // Handle single address.
      if (typeof address === 'string') {
        const response = await axios.get(`${this.restURL}ext/getbalance/${address}`, _this.axiosOptions);
        return response.data;

        // Handle array of addresses.
        // } else if (Array.isArray(address)) {
        //   const response = await axios.post(
        //     `${this.restURL}electrumx/balance`,
        //     {
        //       addresses: address
        //     },
        //     _this.axiosOptions
        //   );

        //   return response.data;
      }

      throw new Error('Input address must be a string or array of strings.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  async transactions(address: string | string[]) {
    try {
      // Handle single address.
      if (typeof address === 'string') {
        const response = await axios.get(`${this.restURL}ext/getaddress/${address}`, _this.axiosOptions);
        return response.data;

        // Handle array of addresses.
        // } else if (Array.isArray(address)) {
        //   const response = await axios.post(
        //     `${this.restURL}electrumx/transactions`,
        //     {
        //       addresses: address
        //     },
        //     _this.axiosOptions
        //   );

        //   return response.data;
      }

      throw new Error('Input address must be a string or array of strings.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  async txData(txid: string) {
    try {
      // Handle single transaction.
      if (typeof txid === 'string') {
        const response = await axios.get(
          `${this.restURL}api/getrawtransaction?txid=${txid}&decrypt=1`,
          _this.axiosOptions
        );
        return response.data;
        // } else if (Array.isArray(txid)) {
        //   const response = await axios.post(
        //     `${this.restURL}electrumx/tx/data`,
        //     {
        //       txids: txid
        //     },
        //     _this.axiosOptions
        //   );

        //   return response.data;
      }

      throw new Error('Input txId must be a string or array of strings.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  async sendRawTransaction(txHex: string) {
    try {
      if (typeof txHex === 'string') {
        console.log(txHex);
        // const response = await axios.post(`${this.restURL}sendrawtransaction`, { txHex }, _this.axiosOptions);
        // return response.data;
        return 'RANDOM_RETURN_HEX';
      }

      throw new Error('Input txHex must be a string.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  // Returns the utxo with the biggest balance from an array of utxos.
  async findBiggestUtxo(utxos: any) {
    let largestAmount = 0;
    let largestIndex = 0;

    for (let i = 0; i < utxos.length; i++) {
      const thisUtxo = utxos[i];
      // console.log(`thisUTXO: ${JSON.stringify(thisUtxo, null, 2)}`);

      // Validate the UTXO data with the full node.
      // const txout = await explorer.getTxOut(thisUtxo.tx_hash, thisUtxo.tx_pos);
      // if (txout === null) {
      //   // If the UTXO has already been spent, the full node will respond with null.
      //   console.log('Stale UTXO found. You may need to wait for the indexer to catch up.');
      //   continue;
      // }

      if (thisUtxo.balance > largestAmount) {
        largestAmount = thisUtxo.balance;
        largestIndex = i;
      }
    }

    // lookup
    const found = utxos[largestIndex];
    const data = await this.txData(found.txid);

    // use first output?
    const vout0 = data.vout[0];
    const niftoshis = vout0.value * 100000000;

    return { niftoshis, value: niftoshis, tx_pos: vout0.n, tx_hash: data.txid };
  }
}

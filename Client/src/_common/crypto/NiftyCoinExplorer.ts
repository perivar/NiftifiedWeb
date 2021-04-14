/*
  This library interacts with the NiftyCoin Explorer REST API endpoints
*/
// Public npm libraries
import axios, { AxiosRequestConfig } from 'axios';
import { UTXOInfo } from './util';

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

  // warning this is a very heavy lookup that might take some time
  async utxo(address: string, count = 50): Promise<UTXOInfo[]> {
    try {
      // Handle single address.
      if (typeof address === 'string') {
        const response = await axios.get(`${this.restURL}ext/getaddresstxs/${address}/0/${count}`, _this.axiosOptions);

        // lookup tx data
        const utxos: UTXOInfo[] = [];

        await Promise.all(
          response.data.map(async (element: any) => {
            const data = await this.txData(element.txid);

            // find a vout with money
            let vout: any = {};
            for (let i = 0; i < data.vout.length; i++) {
              vout = data.vout[i];
              if (vout.value > 0) {
                break;
              }
            }
            const niftoshis = vout.value * 100000000;
            // add some of the same fields with different names to support older functions
            utxos.push({ value: niftoshis, tx_pos: vout.n, tx_hash: data.txid });
          })
        );

        return utxos;
      }

      throw new Error('Input address must be a string');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }

  // this returns the NFY balance
  // needs to multiply with 100000000 to get niftoshis
  async balance(address: string | string[]): Promise<number> {
    try {
      // Handle single address.
      if (typeof address === 'string') {
        const response = await axios.get(`${this.restURL}ext/getbalance/${address}`, _this.axiosOptions);
        if (!response.data.error) {
          return Number(response.data);
        }
        throw `${response.data.error} : ${address}`;

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
        // console.log(txHex);
        // use GET, not POST
        // const response = await axios.post(`${this.restURL}api/sendrawtransaction`, { txHex }, _this.axiosOptions);
        const response = await axios.get(`${this.restURL}api/sendrawtransaction?hex=${txHex}`, _this.axiosOptions);

        // use decode while testing
        // txHex =
        //   '02000000010000000000000000000000000000000000000000000000000000000000000000ffffffff1f02c80004024d3f60088100001401000000746865706f6f6c2e6c6966655c30000000000100f2052a010000001976a914d56967ed64a2f9557e80e5f654c7ba62b2c072cf88ac00000000';
        // const response = await axios.get(`${this.restURL}api/decoderawtransaction?hex=${txHex}`, _this.axiosOptions);
        return response.data;
        // return 'RANDOM_RETURN_HEX';
      }

      throw new Error('Input txHex must be a string.');
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data;
      else throw error;
    }
  }
}

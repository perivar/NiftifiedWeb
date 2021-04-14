/*
  This is the parent library for the SLP class. It was originally forked from slp-sdk.

  TODO: Create an SLP fee calculator like slpjs:
  https://github.com/simpleledger/slpjs/blob/master/lib/slp.ts#L921
*/

import { TokenType1 } from './tokentype1';
import { NFT1 } from './nft1';
import { Utils } from './utils';

// SLP is a superset of BITBOX
export class SLP {
  restURL: string;
  apiToken: string;
  authToken: string;
  axiosOptions: any;
  TokenType1: any;
  NFT1: any;
  Utils: any;

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

    this.TokenType1 = new TokenType1(config);
    this.NFT1 = new NFT1(this.restURL);
    this.Utils = new Utils(config);
  }
}

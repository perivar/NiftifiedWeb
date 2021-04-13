import { NFT1 } from './nft1';
import { SLP } from './slp';
import { TokenType1 } from './tokentype1';
import { Utils } from './utils';

const CryptoLib = {
  NFT1: new NFT1({}),
  SLP: new SLP({}),
  TokenType1: new TokenType1({}),
  Utils: new Utils({})
};

export default CryptoLib;

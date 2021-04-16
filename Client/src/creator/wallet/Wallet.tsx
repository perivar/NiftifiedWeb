import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import { WalletInfo } from '../../_common/crypto/util';
import CryptoWallet from '../../_common/crypto/wallet';
import CryptoNFT from '../../_common/crypto/slp/nft';
import { CryptoLibConfig, SLP } from '../../_common/crypto/lib/slp';

// Set NETWORK to either testnet or mainnet
const NETWORK = 'mainnet';

// REST API servers.
const NFY_MAINNET = 'https://explorer.niftycoin.org/';
const NFY_TESTNET = 'https://testexplorer.niftycoin.org/';

const config: CryptoLibConfig = {
  restURL: NETWORK === 'mainnet' ? NFY_MAINNET : NFY_TESTNET
};
const slp = new SLP(config);

export const Wallet = ({ match }: { match: any }) => {
  // const { path } = match;
  // const { id } = match.params;

  const handleSend = () => {
    // generateWallet();

    // createWallet()
    //   .then((res: any) => {
    //     console.log(res);
    //   })
    //   .catch((err: any) => {
    //     console.log(err);
    //   });

    // let walletInfo = {} as WalletInfo;
    // const wallet = createWallet().then((res: any) => {
    //   walletInfo = res;

    //   getBalance(walletInfo).then((res: any) => {
    //     console.log(res);
    //   });
    // });

    const wallet: WalletInfo = {
      hdNodePath: "'m/44'/145'/0'/0/0'",
      legacyAddress: 'NP1VCzvkzSTeFph1AW4Bs4ELz25mLPHNaZ',
      mnemonic: 'kiwi rescue antique kit love north right wet famous void teach shadow',
      privateKey: '719facd2e47a90c28d2d884e0d63d5bc419736fe84fbda843c346497435df372',
      privateKeyWIF: '8uYHkB5ud6dBoYUugJ6NDx4i5d4KVLinh8XeQrKmDL5wTKVANfNQ',
      publicKey: '03dbd7272cbb67d39d5d01d4275b75211b7c05a2d7bfe687c930adf01ba6a65217',
      segwitAddress: 'MWT7nzgsR57kWS88XRWVu9JBaCbQW313eP'
    };

    // sendNFY(wallet, 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg', 2000).then((res: any) => {
    //   console.log(res);
    // });

    // sendWIF(wallet, 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg', 2000).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoWallet.listUtxos(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // consolidateUtxos(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.createNFTGroup(wallet).then((res: any) => {
    //   console.log(res);

    //   // const tokenData = slp.Utils.decodeTxData(res);
    //   // console.log(tokenData);
    // });

    CryptoNFT.getNFT('3d815beb4639e446aff5e0dd60a9a800e7349dc3c390c6375c063faddd7c2618').then((res: any) => {
      console.log(res);
    });

    // CryptoNFT.createNFTChild(wallet, '').then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.mintNFTGroup(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.sendGroupToken(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.sendChildToken(wallet).then((res: any) => {
    //   console.log(res);
    // });
  };

  return (
    <>
      <h4>Send NiftyCoins:</h4>
      <div className="card bg-light px-md-4 pb-md-2 p-2">
        <div className="card-body">
          <div className="form-group">
            <label htmlFor="receiverAddress" className="col-sm-3 control-label">
              Receiver Address
            </label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="receiverAddress" name="receiverAddress" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="description" className="col-sm-3 control-label">
              Description
            </label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="description" name="description" />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="amount" className="col-sm-3 control-label">
              Amount
            </label>
            <div className="col-sm-9">
              <input type="number" className="form-control" id="amount" name="amount" />
            </div>
          </div>
          {/* <div className="form-group">
            <label htmlFor="status" className="col-sm-3 control-label">
              Status
            </label>
            <div className="col-sm-9">
              <select className="form-control" id="status" name="status">
                <option>Paid</option>
                <option>Unpaid</option>
              </select>
            </div>
          </div> */}
          <div className="form-group">
            <label htmlFor="fee" className="col-sm-3 control-label">
              Fee
            </label>
            <div className="col-sm-9">
              <input type="text" className="form-control" id="fee" name="fee" />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-9">
              <button className="btn btn-success btn-block" onClick={handleSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

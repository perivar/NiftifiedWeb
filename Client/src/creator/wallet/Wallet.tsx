import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import { NFTChildGenesisOpReturnConfig, NFTGroupOpReturnConfig, WalletInfo } from '../../_common/crypto/util';
import CryptoWallet from '../../_common/crypto/wallet';
import CryptoNFT from '../../_common/crypto/slp/nft';

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

    // // SLP NFT config object for the Group
    // const configObjGroup: NFTGroupOpReturnConfig = {
    //   name: 'NFT Test Token',
    //   ticker: 'NFTY',
    //   documentUrl: 'https://www.niftycoin.org',
    //   mintBatonVout: 2, // the minting baton is always on vout 2
    //   initialQty: 1
    // };

    // CryptoNFT.createNFTGroup(wallet, configObjGroup).then((res: any) => {
    //   console.log(res);
    // });

    // Group NFT
    const groupNFTId = '3d815beb4639e446aff5e0dd60a9a800e7349dc3c390c6375c063faddd7c2618';

    // // SLP NFT config object for the child (the actual token)
    // const configObjChild: NFTChildGenesisOpReturnConfig = {
    //   name: 'NFT Test Token Child',
    //   ticker: 'NFTY0001',
    //   documentUrl: 'https://www.niftycoin.org'
    // };

    // CryptoNFT.createNFTChild(wallet, groupNFTId, configObjChild).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoWallet.sendNFY(wallet, 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg', 3000).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoWallet.sendWIF(wallet, 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg', 2000).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoWallet.listUtxos(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // consolidateUtxos(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.getNFT(groupNFTId).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.sendGroupToken(wallet, groupNFTId, 1).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.mintNFTGroup(wallet, groupNFTId, 1).then((res: any) => {
    //   console.log(res);
    // });

    // // child NFT
    // const childNFTId = 'c0c754f9b9ffcb4b678dcaef550f811d90c4534724be9ca760c8cf209e27e6bb';
    // CryptoNFT.getNFT(childNFTId).then((res: any) => {
    //   console.log(res);
    // });

    // CryptoNFT.sendChildToken(wallet, childNFTId, 1).then((res: any) => {
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

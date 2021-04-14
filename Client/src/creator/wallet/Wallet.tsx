import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
// import { sendTransactions, sendNiftyCoin, generateWallet } from '../../_common/crypto/nifty/generate';
import { WalletInfo } from '../../_common/crypto/util';
import { createWallet } from '../../_common/crypto/wallet/create-wallet/create-wallet';
import { getBalance } from '../../_common/crypto/wallet/check-balance/check-balance';
import { sendNFY } from '../../_common/crypto/wallet/send-nfy/send-nfy';
import { sendWIF } from '../../_common/crypto/wallet/send-WIF/send-wif';
import { listUtxos } from '../../_common/crypto/wallet/list-utxos/list-utxos';
import { consolidateUtxos } from '../../_common/crypto/wallet/consolidate-utxos/consolidate-utxos';

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

    sendWIF(wallet, 'NUcBvW67GEqi8CXYPcL4Y5qzw7Vf9rp7wg', 2000).then((res: any) => {
      console.log(res);
    });

    // listUtxos(wallet).then((res: any) => {
    //   console.log(res);
    // });

    // consolidateUtxos(wallet).then((res: any) => {
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

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import { sendTransactions, sendNiftyCoin, generateWallet } from '../../_common/crypto/nifty/generate';

export const Wallet = ({ match }: { match: any }) => {
  // const { path } = match;
  // const { id } = match.params;

  const handleSend = () => {
    // generateWallet();

    // sendTransactions('2nafhgiCX3txpTtokW6XVU5jd1RZijtEfjNbn3euPftpUrht6aJ')
    sendNiftyCoin('2nafhgiCX3txpTtokW6XVU5jd1RZijtEfjNbn3euPftpUrht6aJ')
      .then((res: any) => {
        console.log(res);
      })
      .catch((err: any) => {
        console.log(err);
      });
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

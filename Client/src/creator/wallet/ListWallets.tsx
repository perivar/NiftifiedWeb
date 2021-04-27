import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountService, niftyService, alertService } from '../../_services';
import { Status } from '../../_common/enums';
import ConfirmModal from '../../_common/ConfirmModal';
import { AddWalletModal } from './AddWalletModal';

import './AddCreatorsField.scss';

export const ListWallets = ({ history }: { history: any; match: any }) => {
  // const { path } = match;
  const user = accountService.userValue;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<any>([]);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string | undefined>();

  // add a new wallet using a modal
  const [showAddWalletModal, setShowAddWalletModal] = useState<boolean>(false);

  useEffect(() => {
    // redirect to home if not logged in
    if (!user) {
      history.push('/');
    }
  }, [history]);

  // load volumes async
  useEffect(() => {
    setLoading(true);

    niftyService
      .getWalletsByAccountId()
      .then((res) => {
        setWallets(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const onAddWalletSuccess = (wallet: any) => {
    // reload and add to selected list
    setLoading(true);

    niftyService
      .getWalletsByAccountId()
      .then((res) => {
        setWallets(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onCancelDeleteWallet = () => {
    // make sure to set confirm delete id to zero
    setConfirmDeleteId(0);
    setConfirmDeleteTitle(undefined);
  };

  const confirmDelete = (wallet: any) => {
    const { id } = wallet;
    setConfirmDeleteId(id);
    setConfirmDeleteTitle(wallet.alias ? wallet.alias : wallet.id);
    setShowConfirmModal(true);
  };

  const onConfirmedDeleteWallet = () => {
    if (confirmDeleteId !== 0) {
      // we have a confirmed id
      // alert(confirmDeleteId);

      niftyService.deleteWallet(confirmDeleteId).then(() => {
        // remove from list and re-render
        setWallets(wallets.filter((wallet: any) => wallet.id !== confirmDeleteId));
      });
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setShowAddWalletModal(true)}>
        New Wallet
      </button>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Wallets connected to you</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-center">
                      Confirmed
                    </th>
                    {/* <th scope="col">Type</th> */}
                    <th scope="col">Alias</th>
                    <th scope="col" className="text-center">
                      Anonymous
                    </th>
                    <th scope="col" className="text-center">
                      Details
                    </th>
                    <th scope="col">Edit / Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    wallets &&
                    wallets.map((wallet: any) => (
                      <tr key={wallet.id}>
                        <td>{wallet.id}</td>
                        <td>{Status[wallet.status]}</td>
                        <td className="text-center">
                          {wallet.isConfirmed ? <i className="fas fa-certificate icon-confirmed"></i> : 'No'}
                        </td>
                        {/* <td>{WalletType[wallet.type]}</td> */}
                        <td>{wallet.alias}</td>
                        <td className="text-center">
                          {wallet.isAnonymous ? <i className="fas fa-user-secret"></i> : 'Open'}
                        </td>
                        <td className="text-center">
                          <Link to={`/creator/wallet/${wallet.id}`} className="btn btn-sm btn-light btn-block">
                            Show wallet details
                          </Link>
                        </td>
                        <td className="btn-group">
                          <Link to={`/creator/wallet/edit/${wallet.id}`} className="btn btn-sm btn-secondary mr-1">
                            Edit
                          </Link>
                          {!isLoading ? (
                            <button
                              type="button"
                              onClick={() => confirmDelete(wallet)}
                              className="btn btn-sm btn-danger">
                              Delete
                            </button>
                          ) : (
                            <button type="button" className="btn btn-secondary btn-sm" disabled>
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AddWalletModal
        show={showAddWalletModal}
        setShow={setShowAddWalletModal}
        onSuccess={onAddWalletSuccess}
        onFailure={(error: any) => alertService.error(error)}
      />
      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        onConfirm={onConfirmedDeleteWallet}
        onCancel={onCancelDeleteWallet}
        title={confirmDeleteTitle}
      />
    </>
  );
};

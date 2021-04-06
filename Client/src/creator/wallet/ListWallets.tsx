import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import QRCode from 'qrcode.react';
import { WalletType } from '../../_common/enums';
import ConfirmModal from '../../_common/ConfirmModal';

export const ListWallets = ({ match }: { match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<any>([]);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string | undefined>();

  // load volumes async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getWalletsByPersonId(id)
      .then((res) => {
        setWallets(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  const onCancelDeleteWallet = () => {
    // make sure to set confirm delete id to zero
    setConfirmDeleteId(0);
    setConfirmDeleteTitle(undefined);
  };

  const confirmDelete = (wallet: any) => {
    const { id } = wallet;
    setConfirmDeleteId(id);
    setConfirmDeleteTitle(wallet.name ? wallet.name : wallet.id);
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
      <Link className="btn btn-primary" to={`/creator/profile`}>
        My Profile
      </Link>
      <Link className="btn btn-secondary ml-2" to={`/creator/wallet/new/${id}`}>
        Add Wallet
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Wallets</h4>
            <div className="card-deck">
              {!isLoading &&
                wallets &&
                wallets.map((wallet: any) => (
                  <div className="card" key={wallet.id}>
                    <div className="card-header">
                      <div className="row">
                        <div className="col-md-10">
                          <div className="w-75">{wallet.name ? wallet.name : '(No Name)'}</div>
                        </div>
                        <div className="col-md-2 float-right">
                          <button type="button" onClick={() => confirmDelete(wallet)} className="btn btn-sm btn-danger">
                            Del
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <h5 className="card-title"># {wallet.id}</h5>
                      <div className="card-text">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Type:</strong> {WalletType[wallet.type]}
                          </li>
                          <li className="list-group-item">
                            <div className="mb-2">
                              <strong>Private Key WIF:</strong>
                            </div>
                            <div>
                              <QRCode
                                value={wallet.privateKeyWIFEncrypted}
                                size={1280}
                                bgColor={'#ffffff'}
                                fgColor={'#000000'}
                                level={'H'}
                                includeMargin={false}
                                renderAs={'canvas'}
                                style={{ width: '164px', height: '164px' }}
                              />
                            </div>
                            <code>{wallet.privateKeyWIFEncrypted}</code>
                          </li>
                          <li className="list-group-item">
                            <strong>Private Key:</strong>
                            <div className="mb-2">
                              <small className="text-muted">Hexadecimal format: (64 characters [0-9A-F])</small>
                            </div>
                            <div>
                              <code>{wallet.privateKeyEncrypted}</code>
                            </div>
                          </li>

                          <li className="list-group-item">
                            <div className="mb-2">
                              <strong>Public Address:</strong>
                            </div>
                            <div>
                              <QRCode
                                value={wallet.publicAddress}
                                size={1280}
                                bgColor={'#ffffff'}
                                fgColor={'#000000'}
                                level={'H'}
                                includeMargin={false}
                                renderAs={'canvas'}
                                style={{ width: '164px', height: '164px' }}
                              />
                            </div>
                            <code>{wallet.publicAddress}</code>
                          </li>
                          <li className="list-group-item">
                            <strong>Public Key Hash:</strong>
                            <div className="mb-2">
                              <small className="text-muted">
                                RIPEMD160 ( SHA256(publickey) ) in hexadecimal format: (40 characters [0-9A-F])
                              </small>
                            </div>
                            <div>
                              <QRCode
                                value={wallet.publicKeyHash}
                                size={1280}
                                bgColor={'#ffffff'}
                                fgColor={'#000000'}
                                level={'H'}
                                includeMargin={false}
                                renderAs={'canvas'}
                                style={{ width: '164px', height: '164px' }}
                              />
                            </div>
                            <code>{wallet.publicKeyHash}</code>
                          </li>
                          <li className="list-group-item">
                            <strong>Public Key:</strong>
                            <div className="mb-2">
                              <small className="text-muted">Hexadecimal format: (130 characters [0-9A-F])</small>
                            </div>
                            <div>
                              <code>{wallet.publicKey}</code>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <p className="card-text">
                        <small className="text-muted">Created {new Date(wallet.created).toLocaleString()}</small>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
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

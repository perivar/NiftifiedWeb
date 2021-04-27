import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import QRCode from 'qrcode.react';
import { WalletType } from '../../_common/enums';
import ConfirmModal from '../../_common/ConfirmModal';
import CopyToClipboard from 'react-copy-to-clipboard';

export const ShowWalletDetails = ({ match }: { match: any }) => {
  // const { path } = match;
  const { id } = match.params;

  const history = useHistory();

  const [isLoading, setLoading] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>();

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string | undefined>();

  const [isCopied, setIsCopied] = useState(false);
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  // load wallet by id async
  React.useEffect(() => {
    setLoading(true);
    niftyService
      .getWalletById(id)
      .then((res) => {
        setWallet(res);
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
    setConfirmDeleteTitle(wallet.alias ? wallet.alias : wallet.id);
    setShowConfirmModal(true);
  };

  const onConfirmedDeleteWallet = () => {
    if (confirmDeleteId !== 0) {
      // we have a confirmed id
      // alert(confirmDeleteId);

      niftyService.deleteWallet(confirmDeleteId).then(() => {
        history.push('/creator/profile');
      });
    }
  };

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/profile`}>
        My Profile
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col-sm-6 offset-sm-3">
            <h4>Wallet Detail:</h4>
            <div className="card-deck">
              {!isLoading && wallet && (
                <div className="card" key={wallet.id}>
                  <div className="card-header">
                    <div className="row">
                      <div className="col-md-10">
                        <div className="w-75">
                          #{wallet.id}: {wallet.alias ? wallet.alias : '(No Alias)'}
                        </div>
                      </div>
                      <div className="col-md-2 float-right">
                        <button type="button" onClick={() => confirmDelete(wallet)} className="btn btn-sm btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="card-text">
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <strong>Type:</strong> {WalletType[wallet.type]}
                        </li>
                        {wallet.privateMnemonicEncrypted && (
                          <li className="list-group-item">
                            <strong>Private Mnemonic:</strong>
                            <div className="mb-2">
                              <small className="text-muted">12 english words</small>
                            </div>
                            <div>
                              <div className="input-group">
                                <input
                                  className="form-control form-control-sm"
                                  aria-label="mnemonic"
                                  disabled
                                  value={wallet.privateMnemonicEncrypted}></input>
                                <div className="input-group-append">
                                  <CopyToClipboard text={wallet.privateMnemonicEncrypted} onCopy={onCopyText}>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-sm"
                                      data-toggle="tooltip"
                                      data-placement="bottom"
                                      title="Copy to clipboard">
                                      {isCopied ? 'Copied!' : <i className="far fa-clipboard"></i>}
                                    </button>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            </div>
                          </li>
                        )}
                        {wallet.publicAddress && (
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
                        )}
                        {wallet.publicKeyHash && (
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
                        )}
                        {wallet.publicKey && (
                          <li className="list-group-item">
                            <strong>Public Key:</strong>
                            <div className="mb-2">
                              <small className="text-muted">Hexadecimal format: (130 characters [0-9A-F])</small>
                            </div>
                            <div>
                              <code>{wallet.publicKey}</code>
                            </div>
                          </li>
                        )}
                        {wallet.privateKeyWIFEncrypted && (
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
                        )}
                        {wallet.privateKeyEncrypted && (
                          <li className="list-group-item">
                            <strong>Private Key:</strong>
                            <div className="mb-2">
                              <small className="text-muted">Hexadecimal format: (64 characters [0-9A-F])</small>
                            </div>
                            <div>
                              <code>{wallet.privateKeyEncrypted}</code>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                    <p className="card-text">
                      <small className="text-muted">Created {new Date(wallet.created).toLocaleString()}</small>
                    </p>
                  </div>
                </div>
              )}
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

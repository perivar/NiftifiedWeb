import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import QRCode from 'qrcode.react';

export enum WalletType {
  Nifty,
  Other
}

export const ListWallets = ({ match }: { match: any }) => {
  const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [wallets, setWallets] = useState<any>([]);

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

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/profile`}>
        My Profile
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Wallets</h4>
            <div className="card-deck m-5">
              {!isLoading &&
                wallets &&
                wallets.map((wallet: any) => (
                  <div className="card" key={wallet.id}>
                    <div className="card-body">
                      <h5 className="card-title"># {wallet.id}</h5>
                      <div className="card-text">
                        <ul className="list-group list-group-flush">
                          <li className="list-group-item">
                            <strong>Type:</strong> {WalletType[wallet.type]}
                          </li>
                          <li className="list-group-item">
                            <div className="mb-2">
                              <strong>Private Key WIF (Encrypted):</strong>
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
                            <strong>Private Key Hexadecimal Format (64 characters [0-9A-F]) (Encrypted):</strong>{' '}
                            <code>{wallet.privateKeyEncrypted}</code>
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
                                style={{ width: '132px', height: '132px' }}
                              />
                            </div>
                            <code>{wallet.publicAddress}</code>
                          </li>
                          <li className="list-group-item">
                            <strong>Public Key (130 characters [0-9A-F]):</strong> <code>{wallet.publicKey}</code>
                          </li>
                          <li className="list-group-item">
                            <strong>PublicKey Hash:</strong> <code>{wallet.publicKeyHash}</code>
                          </li>
                        </ul>
                      </div>
                      <p className="card-text">
                        <small className="text-muted">Created {wallet.created}</small>
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

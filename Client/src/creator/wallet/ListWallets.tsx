import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';

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
            <div className="card-deck">
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
                            <strong>PrivateKeyEncrypted:</strong> {wallet.privateKeyEncrypted}
                          </li>
                          <li className="list-group-item">
                            <strong>PrivateKeyWIFEncrypted:</strong> {wallet.privateKeyWIFEncrypted}
                          </li>
                          <li className="list-group-item">
                            <strong>PublicAddress:</strong> {wallet.publicAddress}
                          </li>
                          <li className="list-group-item">
                            <strong>PublicKey:</strong> {wallet.publicKey}
                          </li>
                          <li className="list-group-item">
                            <strong>PublicKeyHash:</strong> {wallet.publicKeyHash}
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

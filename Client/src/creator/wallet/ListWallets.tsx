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
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Type</th>
                  <th scope="col">private key</th>
                  <th scope="col">private wif</th>
                  <th scope="col">public address</th>
                  <th scope="col">public key</th>
                  <th scope="col">public key hash</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  wallets &&
                  wallets.map((wallet: any) => (
                    <tr key={wallet.id}>
                      <td>{wallet.id}</td>
                      <td>{WalletType[wallet.type]}</td>
                      <td>{wallet.privateKeyEncrypted}</td>
                      <td>{wallet.privateKeyWIFEncrypted}</td>
                      <td>{wallet.publicAddress}</td>
                      <td>{wallet.publicKey}</td>
                      <td>{wallet.publicKeyHash}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

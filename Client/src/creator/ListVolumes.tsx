import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService, alertService } from '../_services';

export const ListVolumes = ({ match }: { match: any }) => {
  const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [volumes, setVolumes] = useState<any>([]);

  // load volumes async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getVolumesByEditionId(id)
      .then((res) => {
        setVolumes(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Link className="btn btn-primary" to={`${path}/new`}>
        Publish / Mint
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Your volumes</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Status</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Currency</th>
                  <th scope="col">Type</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  volumes &&
                  volumes.map((volume: any) => (
                    <tr key={volume.id}>
                      <td>{volume.editionNumber}</td>
                      <td>{volume.status}</td>
                      <td>{volume.amount}</td>
                      <td>{volume.currencyUniqueId}</td>
                      <td>{volume.type}</td>
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

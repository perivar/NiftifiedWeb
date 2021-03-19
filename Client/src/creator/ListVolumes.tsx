import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../_services';

export enum VolumeType {
  Auction,
  FixedPrice
}

export enum VolumeStatus {
  Pending, // not yet minted
  ForSale, // ready to be sold
  NotForSale // not set to be sold
}

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
  }, [id]);

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/edition/publish/${id}`}>
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
                  <th scope="col">Current Owner</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  volumes &&
                  volumes.map((volume: any) => (
                    <tr key={volume.id}>
                      <td>{volume.editionNumber}</td>
                      <td>{VolumeStatus[volume.status]}</td>
                      <td>{volume.amount}</td>
                      <td>{volume.currencyUniqueId}</td>
                      <td>{VolumeType[volume.type]}</td>
                      <td>{volume.owner.alias ? volume.owner.alias : volume.owner.uniqueId}</td>
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

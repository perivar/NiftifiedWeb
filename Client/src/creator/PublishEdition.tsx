import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../_services';

export const PublishEdition = ({ match }: { match: any }) => {
  const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [edition, setEdition] = useState<any>([]);

  // load edition async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getEditionById(id)
      .then((res) => {
        setEdition(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/volumes/${id}`}>
        Volumes
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Publish and mint you edition</h4>
            <h5>Show cost etc...</h5>
            {!isLoading && edition && <div>{edition.name}</div>}
            <button className="btn btn-primary btn-lg mt-4">Mint</button>
          </div>
        </div>
      </div>
    </>
  );
};

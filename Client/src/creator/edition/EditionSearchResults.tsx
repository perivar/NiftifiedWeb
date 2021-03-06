import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';

// read from .env files
const config = { storedFilesPath: process.env.REACT_APP_STORED_FILES_PATH };

export const EditionSearchResults = ({ match }: { match: any }) => {
  const { path } = match;
  const { query } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [editions, setEditions] = useState<any>([]);

  // load editions async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getEditionsByQuery(query)
      .then((res) => {
        setEditions(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [query]);

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/edition/new`}>
        Create New Edition
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Search results</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Version</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  editions &&
                  editions.map((edition: any) => (
                    <tr key={edition.id}>
                      <td>
                        <img
                          alt={edition.name}
                          height="150"
                          width="150"
                          src={`${config.storedFilesPath}/${edition.dataSourceFileName}`}></img>
                      </td>
                      <td>{edition.id}</td>
                      <td>{edition.name}</td>
                      <td>{edition.description}</td>
                      <td>{edition.version}</td>
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

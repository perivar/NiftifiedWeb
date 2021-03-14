import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService, alertService } from '../_services';

export const EditEditionForm = ({ history, match }: { history: any; match: any }) => {
  const { path } = match;
  const { id } = match.params;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [edition, setEdition] = useState<any>([]);

  // load tag options async
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
  }, []);

  return (
    <>
      Edit Edition
      {edition && (
        <tr key={edition.id}>
          <td>
            <img alt={edition.name} height="80" src={`/stored-images/${edition.dataSourceFileName}`}></img>
          </td>
          <td>{edition.id}</td>
          <td>{edition.name}</td>
          <td>{edition.description}</td>
        </tr>
      )}
    </>
  );
};

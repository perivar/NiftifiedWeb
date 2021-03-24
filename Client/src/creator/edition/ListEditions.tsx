import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { niftyService } from '../../_services';
import ConfirmModal from '../../_common/ConfirmModal';

export const ListEditions = ({ match }: { match: any }) => {
  const { path } = match;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [editions, setEditions] = useState<any>([]);
  // const [editionsEditable, setEditionsEditable] = useState<any>([]);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);

  // load editions async
  React.useEffect(() => {
    setLoading(true);

    niftyService
      .getEditionsByAccountId()
      .then((res) => {
        setEditions(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // check if any of them are non editable (i.e. some volumes are non-pending)
  // React.useEffect(() => {
  //   if (editions && editions.length > 0) {
  //     editions.forEach((e: any) => {
  //       niftyService
  //         .getEditionIsEditable(e.id)
  //         .then((res: any) => {
  //           console.log(res);
  //           setEditionsEditable((editionsEditable: any) => [...editionsEditable, res]);
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     });
  //   }
  // }, [editions]);

  const onCancelDeleteEdition = () => {
    // make sure to set confirm delete id to zero
    setConfirmDeleteId(0);
  };

  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id);
    setShowConfirmModal(true);
  };

  const onConfirmedDeleteEdition = () => {
    if (confirmDeleteId !== 0) {
      // we have a confirmed id
      // alert(confirmDeleteId);

      niftyService.deleteEdition(confirmDeleteId).then(() => {
        // remove from list and re-render
        setEditions(editions.filter((edition: any) => edition.id !== confirmDeleteId));
      });
    }
  };

  return (
    <>
      <Link className="btn btn-primary" to={`${path}/edition/new`}>
        Create New Edition
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Your editions</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Version</th>
                  <th scope="col" className="text-center">
                    Show / Mint Volumes
                  </th>
                  <th scope="col" className="text-center">
                    Publish / Edit / Delete
                  </th>
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
                          height="80"
                          width="80"
                          src={`/stored-images/${edition.dataSourceFileName}`}></img>
                      </td>
                      <td>{edition.id}</td>
                      <td>{edition.name}</td>
                      <td>{edition.description}</td>
                      <td>{edition.version}</td>
                      {/* <td>{edition.volumes.length}</td> */}
                      <td>
                        <Link to={`${path}/volumes/${edition.id}`} className="btn btn-sm btn-light btn-block">
                          {edition.volumesCount}
                        </Link>
                      </td>
                      <td className="text-center">
                        <Link to={`${path}/edition/publish/${edition.id}`} className="btn btn-sm btn-primary mr-1">
                          Publish
                        </Link>
                        <Link to={`${path}/edition/edit/${edition.id}`} className="btn btn-sm btn-secondary mr-1">
                          Edit
                        </Link>
                        {!isLoading ? (
                          // editionsEditable && editionsEditable[edition.id] ? (
                          // edition && edition.volumes && edition.volumes.every((v: any) => v.status === 0) ? (
                          <button onClick={() => confirmDelete(edition.id)} className="btn btn-sm btn-danger">
                            Delete
                          </button>
                        ) : (
                          <button type="button" className="btn btn-secondary btn-sm" disabled>
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        onConfirm={onConfirmedDeleteEdition}
        onCancel={onCancelDeleteEdition}
      />
    </>
  );
};

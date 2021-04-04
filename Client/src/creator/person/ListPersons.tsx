import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountService, niftyService, alertService } from '../../_services';
import { Status } from '../../_common/enums';
import ConfirmModal from '../../_common/ConfirmModal';
import { AddPersonModal } from './AddPersonModal';

import './AddCreatorsField.scss';

export const ListPersons = ({ history }: { history: any; match: any }) => {
  // const { path } = match;
  const user = accountService.userValue;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [persons, setPersons] = useState<any>([]);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);

  // add a new person using a modal
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);

  useEffect(() => {
    // redirect to home if not logged in
    if (!user) {
      history.push('/');
    }
  }, [history]);

  // load volumes async
  useEffect(() => {
    setLoading(true);

    niftyService
      .getPersonsByAccountId()
      .then((res) => {
        setPersons(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  const onAddPersonSuccess = (person: any) => {
    // reload and add to selected list
    setLoading(true);

    niftyService
      .getPersonsByAccountId()
      .then((res) => {
        setPersons(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onCancelDeletePerson = () => {
    // make sure to set confirm delete id to zero
    setConfirmDeleteId(0);
  };

  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id);
    setShowConfirmModal(true);
  };

  const onConfirmedDeletePerson = () => {
    if (confirmDeleteId !== 0) {
      // we have a confirmed id
      // alert(confirmDeleteId);

      niftyService.deletePerson(confirmDeleteId).then(() => {
        // remove from list and re-render
        setPersons(persons.filter((person: any) => person.id !== confirmDeleteId));
      });
    }
  };

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setShowAddPersonModal(true)}>
        Add New Person
      </button>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Persons connected to you</h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-center">
                      Confirmed
                    </th>
                    {/* <th scope="col">Type</th> */}
                    <th scope="col">Alias</th>
                    <th scope="col" className="text-center">
                      Anonymous
                    </th>
                    <th scope="col" className="text-center">
                      Wallets
                    </th>
                    <th scope="col">Edit / Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {!isLoading &&
                    persons &&
                    persons.map((person: any) => (
                      <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{Status[person.status]}</td>
                        <td className="text-center">
                          {person.isConfirmed ? <i className="fas fa-certificate icon-confirmed"></i> : 'No'}
                        </td>
                        {/* <td>{PersonType[person.type]}</td> */}
                        <td>{person.alias}</td>
                        <td className="text-center">
                          {person.isAnonymous ? <i className="fas fa-user-secret"></i> : 'Open'}
                        </td>
                        <td className="text-center">
                          {person.wallets && person.wallets.length ? (
                            <Link to={`/creator/wallets/${person.id}`} className="btn btn-sm btn-light btn-block">
                              {person.wallets.length}
                            </Link>
                          ) : (
                            'None'
                          )}
                        </td>

                        <td className="btn-group">
                          <Link to={`/creator/person/edit/${person.id}`} className="btn btn-sm btn-secondary mr-1">
                            Edit
                          </Link>
                          {!isLoading ? (
                            <button
                              type="button"
                              onClick={() => confirmDelete(person.id)}
                              className="btn btn-sm btn-danger">
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
      </div>
      <AddPersonModal
        show={showAddPersonModal}
        setShow={setShowAddPersonModal}
        onSuccess={onAddPersonSuccess}
        onFailure={(error: any) => alertService.error(error)}
      />
      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        onConfirm={onConfirmedDeletePerson}
        onCancel={onCancelDeletePerson}
      />
    </>
  );
};

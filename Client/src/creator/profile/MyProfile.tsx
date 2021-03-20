import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { accountService, niftyService } from '../../_services';
import { Status, PersonType } from '../person/NewPerson';

export const MyProfile = ({ history, match }: { history: any; match: any }) => {
  const { path } = match;
  const user = accountService.userValue;

  const [isLoading, setLoading] = useState<boolean>(false);
  const [persons, setPersons] = useState<any>([]);

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
      .getPersons()
      .then((res) => {
        setPersons(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/person/new`}>
        Add Person with Wallet
      </Link>
      <div className="container mt-4">
        <div className="row">
          <div className="col">
            <h4>Persons connected to you</h4>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Status</th>
                  <th scope="col">Type</th>
                  <th scope="col">Alias</th>
                  <th scope="col">isAnonymous</th>
                  <th scope="col">Commision Share</th>
                  <th scope="col">Wallets</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  persons &&
                  persons.map((person: any) => (
                    <tr key={person.id}>
                      <td>{person.id}</td>
                      <td>{Status[person.status]}</td>
                      <td>{PersonType[person.type]}</td>
                      <td>{person.alias}</td>
                      <td>
                        {person.isAnonymous ? (
                          <i className="fas fa-user-secret"></i>
                        ) : (
                          <i className="fas fa-lock-open"></i>
                        )}
                      </td>
                      <td>{person.salesCommisionShare}</td>
                      <td>
                        {person.wallets && person.wallets.length ? (
                          <Link to={`/creator/wallets/${person.id}`} className="btn btn-sm btn-light btn-block">
                            {person.wallets.length}
                          </Link>
                        ) : (
                          'None'
                        )}
                      </td>
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

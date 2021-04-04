import React from 'react';
import { Link } from 'react-router-dom';
import { ListPersons } from '../person/ListPersons';

import { Role } from '../../_helpers';
import { accountService } from '../../_services';

export const MyProfile = ({ history, match }: { history: any; match: any }) => {
  // const { path } = match;

  const user = accountService.userValue;
  return (
    <>
      <div className="mb-2">
        <Link className="btn btn-secondary" to={`/profile`}>
          <i className="fa fa-user"></i> My Profile
        </Link>
        {user.role === Role.Admin && (
          <Link to="/admin" className="ml-1 btn btn-secondary">
            Admin
          </Link>
        )}
        <a onClick={accountService.logout} className="ml-1 btn btn-secondary" role="button" tabIndex={0}>
          Logout
        </a>
      </div>
      <ListPersons history={history} match={match} />
    </>
  );
};

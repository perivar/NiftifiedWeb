import React from 'react';
import { Link } from 'react-router-dom';

import { accountService } from '../_services';

function Details({ match }: { match: any }) {
  const { path } = match;
  const user = accountService.userValue;

  return (
    <div>
      <h4>
        <i className="fa fa-user"></i> My Profile
      </h4>
      <p>
        <strong>Name: </strong> {user.firstName} {user.lastName}
        <br />
        <strong>Email: </strong> {user.email}
      </p>
      <p>
        <Link to={`${path}/update`}>Update Profile</Link>
      </p>
    </div>
  );
}

export { Details };

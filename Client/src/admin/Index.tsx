import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Overview } from './Overview';
import { Users } from './users/Index';

function Admin({ match }: { match: any }) {
  const { path } = match;

  return (
    <>
      <div className="container-fluid">
        <div className="mb-2">
          <Link className="btn btn-secondary" to={`/creator/profile`}>
            <i className="fa fa-user"></i> Home
          </Link>
        </div>
        <div className="p-4 card">
          <Switch>
            <Route exact path={path} component={Overview} />
            <Route path={`${path}/users`} component={Users} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export { Admin };

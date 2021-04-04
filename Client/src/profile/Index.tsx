import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import { Details } from './Details';
import { Update } from './Update';

function Profile({ match }: { match: any }) {
  const { path } = match;

  return (
    <>
      <div className="mb-2">
        <Link className="btn btn-secondary" to={`/creator/profile`}>
          <i className="fa fa-user"></i> Home
        </Link>
      </div>
      <div className="p-4 card">
        <div className="container">
          <Switch>
            <Route exact path={path} component={Details} />
            <Route path={`${path}/update`} component={Update} />
          </Switch>
        </div>
      </div>
    </>
  );
}

export { Profile };

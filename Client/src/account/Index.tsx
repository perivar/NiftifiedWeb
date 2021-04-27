import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import { accountService } from '../_services';

import { Login } from './Login';
import { Register } from './Register';
import { VerifyEmail } from './VerifyEmail';
import { ForgotPassword } from './ForgotPassword';
import { ResetPassword } from './ResetPassword';

function Account({ history, match }: { history: any; match: any }) {
  const { path } = match;

  useEffect(() => {
    // redirect to home if already logged in
    if (accountService.userValue) {
      history.push('/');
    }
  }, [history]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-6 offset-sm-3 mt-4">
          <div className="card m-1">
            <Switch>
              <Route path={`${path}/login`} component={Login} />
              <Route path={`${path}/register`} component={Register} />
              <Route path={`${path}/verify-email`} component={VerifyEmail} />
              <Route path={`${path}/forgot-password`} component={ForgotPassword} />
              <Route path={`${path}/reset-password`} component={ResetPassword} />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Account };

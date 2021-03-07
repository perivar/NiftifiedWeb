import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';

import { Role } from '../_helpers';
import { accountService } from '../_services';
import { Nav, PrivateRoute, Alert } from '../_components';
import { Home } from '../home/Index';
import { Profile } from '../profile/Index';
import { Admin } from '../admin/Index';
import { Account } from '../account/Index';
import { Frontpage } from '../frontpage/Index';

function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const subscription = accountService.user.subscribe((x: any) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  return (
    <div className={`app-container${user ? ' bg-light' : ''}`}>
      <Nav />
      <Alert />
      <Switch>
        <Redirect from="/:url*(/+)" to={pathname ? pathname.slice(0, -1) : '/'} />
        <PrivateRoute exact path="/home" component={Home} />
        <PrivateRoute path="/profile" component={Profile} />
        <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
        <Route path="/account" component={Account} />
        <Route path="/" component={Frontpage} />
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}

export { App };

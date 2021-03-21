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
import { Creator } from '../creator/Index';
import { Layout } from './Layout';

// payments
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// read from .env files
const config = { stripeTestKey: process.env.REACT_APP_STRIPE_PK_TEST_KEY };

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(config.stripeTestKey || '');

const STRIPE_ELEMENTS_OPTIONS = {
  fonts: [
    {
      cssSrc: 'https://fonts.googleapis.com/css?family=Roboto'
    }
  ]
};

function App() {
  const { pathname } = useLocation();
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const subscription = accountService.user.subscribe((x: any) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  return (
    <Elements stripe={stripePromise} options={STRIPE_ELEMENTS_OPTIONS}>
      <Layout>
        <Alert />
        <Switch>
          <Redirect from="/:url*(/+)" to={pathname ? pathname.slice(0, -1) : '/'} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute path="/admin" roles={[Role.Admin]} component={Admin} />
          <PrivateRoute path="/creator" component={Creator} />
          <Route path="/account" component={Account} />
          <Route path="/frontpage" component={Frontpage} />
          <Redirect from="*" to="/frontpage" />
        </Switch>
      </Layout>
    </Elements>
  );
}

export { App };

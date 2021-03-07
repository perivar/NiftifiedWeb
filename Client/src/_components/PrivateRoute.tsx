import React from 'react';
import { Route, Redirect, RouteProps, RouteComponentProps } from 'react-router-dom';

import { accountService } from '../_services';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
  roles?: string[];
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, roles, ...rest } = props;

  const render = (props: RouteComponentProps<any>): React.ReactNode => {
    const user = accountService.userValue;
    if (user) {
      // check if route is restricted by role
      if (roles && roles.indexOf(user.role) === -1) {
        // role not authorized so redirect to home page
        return <Redirect to={{ pathname: '/' }} />;
      }
      // authorized so return component
      return <Component {...props} />;
    }

    // not logged in so redirect to login page with the return url
    return <Redirect to={{ pathname: '/account/login', state: { from: props.location } }} />;
  };

  // eslint-disable-next-line react/jsx-no-bind
  return <Route {...rest} render={render} />;
};

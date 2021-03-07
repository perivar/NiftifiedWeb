import React, { useState, useEffect } from 'react';
import { NavLink, Route } from 'react-router-dom';

import { Role } from '../_helpers';
import { accountService } from '../_services';

function Nav() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const subscription = accountService.user.subscribe((x: any) => setUser(x));
    return subscription.unsubscribe;
  }, []);

  // only show nav when logged in
  if (!user) return null;

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav">
          <NavLink exact to="/" className="nav-item nav-link">
            Home
          </NavLink>
          <NavLink to="/profile" className="nav-item nav-link">
            Profile
          </NavLink>
          {user.role === Role.Admin && (
            <NavLink to="/admin" className="nav-item nav-link">
              Admin
            </NavLink>
          )}
          <a onClick={accountService.logout} className="nav-item nav-link" role="button" tabIndex={0}>
            Logout
          </a>
        </div>
      </nav>
      <Route path="/admin" component={AdminNav} />
    </div>
  );
}

function AdminNav({ match }: { match: any }) {
  const { path } = match;

  return (
    <nav className="admin-nav navbar navbar-expand navbar-light">
      <div className="navbar-nav">
        <NavLink to={`${path}/users`} className="nav-item nav-link">
          Users
        </NavLink>
      </div>
    </nav>
  );
}

export { Nav };

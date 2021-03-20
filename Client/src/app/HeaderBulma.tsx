import React from 'react';
import { NavLink } from 'react-router-dom';

export const HeaderBulma = () => {
  return (
    <>
      <header>
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <NavLink exact to="/" className="navbar-item">
              <img src="/niftified-logo.svg" alt="Logo" width="200" className="d-inline-block align-top" />
            </NavLink>

            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarNiftified">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarNiftified" className="navbar-menu">
            <div className="navbar-start">
              <NavLink to="/creator" className="navbar-item">
                Sell your creations
              </NavLink>
            </div>

            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons">
                  <NavLink to="/account/register" className="button is-primary">
                    <strong>Sign up</strong>
                  </NavLink>
                  <NavLink to="/account/login" className="button is-light">
                    Login
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

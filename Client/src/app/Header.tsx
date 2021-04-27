import React, { useState } from 'react';
import { Navbar, Nav, Form, Button } from 'react-bootstrap';
import { useHistory, NavLink } from 'react-router-dom';
import { accountService } from '../_services';

export const Header = () => {
  const user = accountService.userValue;

  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    if (searchQuery.length > 0) history.push(`/creator/editions/${searchQuery}`);
    e.preventDefault();
  };

  return (
    <>
      <header>
        <Navbar className="navbar-light" bg="light" expand="lg" expanded={expanded}>
          <NavLink exact to="/" className="nav-item nav-link">
            <img src="/niftified-logo.svg" alt="Logo" width="200" className="d-inline-block align-top" />
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavLink
                exact
                to="/"
                className="nav-item nav-link"
                onClick={() =>
                  setTimeout(() => {
                    setExpanded(false);
                  }, 150)
                }>
                Home
              </NavLink>
              {user ? (
                <>
                  <NavLink
                    to="/creator/profile"
                    className="nav-item nav-link mr-2"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }>
                    <i className="fas fa-wallet"></i>
                  </NavLink>
                  {/* <NavLink
                    to="/creator/wallet"
                    className="nav-item nav-link mr-2"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }>
										<i className="fa fa-user"></i>
                  </NavLink> */}
                </>
              ) : (
                <>
                  <NavLink
                    to="/account/register"
                    className="nav-item btn btn-secondary mr-1 mb-1"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }>
                    Sign up
                  </NavLink>
                  <NavLink
                    to="/account/login"
                    className="nav-item btn btn-warning mr-1 mb-1"
                    onClick={() =>
                      setTimeout(() => {
                        setExpanded(false);
                      }, 150)
                    }>
                    Sign in
                  </NavLink>
                </>
              )}
              <NavLink
                to="/creator"
                className="btn btn-primary mr-1 mb-1"
                onClick={() =>
                  setTimeout(() => {
                    setExpanded(false);
                  }, 150)
                }>
                Sell your creations
              </NavLink>
              <Form inline className="ml-2 my-2 my-lg-0" onSubmit={handleSubmit}>
                <input
                  className="form-control mr-sm-2"
                  type="search"
                  placeholder="Find ..."
                  aria-label="Find"
                  value={searchQuery}
                  onInput={(e: any) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="my-2 my-sm-0" variant="outline-primary">
                  Search
                </Button>
              </Form>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    </>
  );
};

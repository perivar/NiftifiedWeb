import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { accountService } from '../_services';

export const Header = () => {
  const user = accountService.userValue;

  return (
    <>
      <header>
        <Navbar className="navbar-light" bg="light" expand="lg">
          <NavLink exact to="/" className="nav-item nav-link">
            <img src="/niftified-logo.svg" alt="Logo" width="200" className="d-inline-block align-top" />
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <NavLink exact to="/" className="nav-item nav-link">
                Home
              </NavLink>
              {user ? (
                <NavLink to="/creator/profile" className="nav-item nav-link mr-2">
                  <i className="fa fa-user"></i>
                </NavLink>
              ) : (
                <>
                  <NavLink to="/account/register" className="nav-item btn btn-secondary mr-2">
                    Sign up
                  </NavLink>
                  <NavLink to="/account/login" className="nav-item btn btn-warning mr-2">
                    Sign in
                  </NavLink>
                </>
              )}
              <NavLink to="/creator" className="btn btn-primary">
                Sell your creations
              </NavLink>
              <Form inline className="ml-2 my-2 my-lg-0">
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button className="my-2 my-sm-0" variant="outline-primary">
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

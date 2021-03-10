import React from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

export const Header = () => {
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
              <NavLink to="/account/register" className="nav-item nav-link">
                Register
              </NavLink>
              <NavLink to="/account/login" className="nav-item nav-link">
                Login
              </NavLink>
              <NavLink to="/about" className="nav-item nav-link">
                About
              </NavLink>
              <NavLink to="/creator" className="nav-item nav-link">
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

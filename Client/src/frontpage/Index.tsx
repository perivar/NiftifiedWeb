import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ItemDetail } from './ItemDetail';
import { ItemList } from './ItemList';

function Frontpage({ match }: { match: any }) {
  const { path } = match;

  return (
    <>
      <header>
        <div className="pp-header">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
              <a href="/">
                <img src="/niftified-logo.svg" alt="Logo" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup"
                aria-expanded="false"
                aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item active">
                    <a className="nav-link" href="/">
                      Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/account/register">
                      Register
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/account/login">
                      Login
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="about.html">
                      About
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="contact.html">
                      Sell your creations
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="page-content">
        <div className="container">
          <div className="container pp-section">
            <div className="row">
              <div className="col-md-9 col-sm-12 px-0">
                <h1 className="h4">Collect and create Nifties - crypto protected digital art / music / sound</h1>
              </div>
            </div>
          </div>
          <Switch>
            <Route exact path="/" component={ItemList} />
            <Route path="/detail/:id" component={ItemDetail} />
          </Switch>
        </div>
      </div>

      <footer className="pp-footer">
        <div className="container py-5">
          <div className="row text-center">
            <div className="col-md-12">
              <a className="pp-facebook btn btn-link" href="#">
                <i className="fab fa-facebook-f fa-2x " aria-hidden="true"></i>
              </a>
              <a className="pp-twitter btn btn-link " href="#">
                <i className="fab fa-twitter fa-2x " aria-hidden="true"></i>
              </a>
              <a className="pp-youtube btn btn-link" href="#">
                <i className="fab fa-youtube fa-2x" aria-hidden="true"></i>
              </a>
              <a className="pp-instagram btn btn-link" href="#">
                <i className="fab fa-instagram fa-2x " aria-hidden="true"></i>
              </a>
            </div>
            <div className="col-md-12">
              <p className="mt-3">Copyright &copy; Niftified. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export { Frontpage };

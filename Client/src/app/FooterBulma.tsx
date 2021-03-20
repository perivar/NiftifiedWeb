import React from 'react';

export const FooterBulma = () => {
  return (
    <>
      <footer className="footer">
        <div className="content has-text-centered">
          <div className="columns">
            <div className="column">
              <a className="pp-facebook icon" href="#">
                <i className="fab fa-facebook-f fa-2x " aria-hidden="true"></i>
              </a>
              <a className="pp-twitter icon" href="#">
                <i className="fab fa-twitter fa-2x " aria-hidden="true"></i>
              </a>
              <a className="pp-youtube icon" href="#">
                <i className="fab fa-youtube fa-2x" aria-hidden="true"></i>
              </a>
              <a className="pp-instagram icon" href="#">
                <i className="fab fa-instagram fa-2x " aria-hidden="true"></i>
              </a>
            </div>
            <div className="column">
              <div className="mt-3">Copyright &copy; Niftified. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

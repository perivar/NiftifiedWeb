import React from 'react';

export const Footer = () => {
  return (
    <>
      <footer className="pp-footer">
        <div className="container py-5">
          <div className="row text-center">
            <div className="col-md-12">
              <a className="pp-facebook btn btn-link" href="#">
                <i className="fab fa-facebook-f fa-2x" aria-hidden="true"></i>
              </a>
              <a className="pp-twitter btn btn-link " href="#">
                <i className="fab fa-twitter fa-2x" aria-hidden="true"></i>
              </a>
              <a className="pp-youtube btn btn-link" href="#">
                <i className="fab fa-youtube fa-2x" aria-hidden="true"></i>
              </a>
              <a className="pp-instagram btn btn-link" href="#">
                <i className="fab fa-instagram fa-2x" aria-hidden="true"></i>
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
};

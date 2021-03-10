import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <Header />
      <div className="page-content">
        <div className="container">
          <div className="container pp-section">
            <div className="row">
              <div className="col-md-9 col-sm-12 px-0">
                <h1 className="h4">Collect and create Nifties - crypto protected digital art / music / sound</h1>
              </div>
            </div>
          </div>
          {props.children}
        </div>
      </div>
      <Footer />
    </>
  );
};

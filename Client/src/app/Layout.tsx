import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
// import { HeaderBulma } from './HeaderBulma';
// import { FooterBulma } from './FooterBulma';

interface Props {
  children: React.ReactNode;
}

export const Layout: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <Header />
      <div className="page-content">
        <div className="container-fluid mt-3 mb-3">{props.children}</div>
      </div>
      <Footer />
    </>
  );
};

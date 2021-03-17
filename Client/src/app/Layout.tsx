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
        <div className="container mt-3">{props.children}</div>
      </div>
      <Footer />
    </>
  );
};

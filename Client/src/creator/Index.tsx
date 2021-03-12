import React from 'react';
// import { Route, Switch } from 'react-router-dom';
// import ImgPrev from './ImgPrev';
import { NewEditionForm } from './NewEdition';

function Creator({ match }: { match: any }) {
  // const { path } = match;

  return (
    <>
      {/* <ImgPrev></ImgPrev> */}
      <NewEditionForm />
    </>
  );
}

export { Creator };

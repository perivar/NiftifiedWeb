import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ImgPrev from './ImgPrev';
import { NewEdition } from './NewEdition';

function Creator({ match }: { match: any }) {
  const { path } = match;

  return (
    <>
      {/* <ImgPrev></ImgPrev> */}
      <NewEdition />
    </>
  );
}

export { Creator };

import React from 'react';
// import { Link } from 'react-router-dom';
import { ListPersons } from '../person/ListPersons';

export const MyProfile = ({ history, match }: { history: any; match: any }) => {
  // const { path } = match;

  return (
    <>
      <ListPersons history={history} match={match} />
    </>
  );
};

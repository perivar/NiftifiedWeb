import React from 'react';
import { Link } from 'react-router-dom';
import { ListPersons } from '../person/ListPersons';

export const MyProfile = ({ history, match }: { history: any; match: any }) => {
  const { path } = match;

  return (
    <>
      <Link className="btn btn-primary" to={`/creator/person/new`}>
        Add Person with Wallet
      </Link>
      <ListPersons history={history} match={match} />
    </>
  );
};

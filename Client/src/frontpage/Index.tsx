import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ItemDetail } from './ItemDetail';
import { ItemList } from './ItemList';

function Frontpage({ match }: { match: any }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={path} component={ItemList} />
      <Route path={`${path}/detail/:id`} component={ItemDetail} />
    </Switch>
  );
}

export { Frontpage };

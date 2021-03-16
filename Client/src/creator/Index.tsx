import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './NewEdition';
import { EditEditionForm } from './EditEdition';
import { ListEditions } from './ListEditions';
import { ListVolumes } from './ListVolumes';

function Creator({ history, match }: { history: any; match: any }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={`${path}`} component={ListEditions} />
      <Route path={`${path}/new`} component={NewEditionForm} />
      <Route path={`${path}/edit/:id`} component={EditEditionForm} />
      <Route path={`${path}/volumes/:id`} component={ListVolumes} />
    </Switch>
  );
}

export { Creator };

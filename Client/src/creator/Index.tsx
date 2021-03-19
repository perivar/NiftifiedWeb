import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './NewEdition';
import { EditEditionForm } from './EditEdition';
import { ListEditions } from './ListEditions';
import { ListVolumes } from './ListVolumes';
import { PublishEdition } from './PublishEdition';
import { NewPersonForm } from './NewPerson';

function Creator({ history, match }: { history: any; match: any }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={`${path}`} component={ListEditions} />
      <Route path={`${path}/edition/new`} component={NewEditionForm} />
      <Route path={`${path}/edition/edit/:id`} component={EditEditionForm} />
      <Route path={`${path}/edition/publish/:id`} component={PublishEdition} />
      <Route path={`${path}/volumes/:id`} component={ListVolumes} />
      <Route path={`${path}/person/new`} component={NewPersonForm} />
    </Switch>
  );
}

export { Creator };

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './edition/NewEdition';
import { EditEditionForm } from './edition/EditEdition';
import { ListEditions } from './edition/ListEditions';
import { ListVolumes } from './volume/ListVolumes';
import { PublishEdition } from './edition/PublishEdition';
import { NewPersonForm } from './person/NewPerson';
import { EditPersonForm } from './person/EditPerson';
import { MyProfile } from './profile/MyProfile';
import { ListWallets } from './wallet/ListWallets';

function Creator({ history, match }: { history: any; match: any }) {
  const { path } = match;

  return (
    <Switch>
      <Route exact path={`${path}`} component={ListEditions} />
      <Route path={`${path}/edition/new`} component={NewEditionForm} />
      <Route path={`${path}/edition/edit/:id`} component={EditEditionForm} />
      <Route path={`${path}/edition/publish/:id`} component={PublishEdition} />
      <Route path={`${path}/volumes/:id`} component={ListVolumes} />
      {/* <Route path={`${path}/person/new`} component={NewPersonForm} /> */}
      <Route path={`${path}/person/edit/:id`} component={EditPersonForm} />
      <Route path={`${path}/profile`} component={MyProfile} />
      <Route path={`${path}/wallets/:id`} component={ListWallets} />
    </Switch>
  );
}

export { Creator };

import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './edition/NewEdition';
import { EditEditionForm } from './edition/EditEdition';
import { ListEditions } from './edition/ListEditions';
import { ListVolumes } from './volume/ListVolumes';
import { PublishEdition } from './edition/PublishEdition';
import { EditionSearchResults } from './edition/EditionSearchResults';
// import { NewPersonForm } from './person/NewPerson';
import { EditPersonForm } from './person/EditPerson';
import { MyProfile } from './profile/MyProfile';
import { ListWallets } from './wallet/ListWallets';
import { WalletTransactions } from './wallet/WalletTransactions';
import { NewWalletForm } from './wallet/NewWallet';

// shared context provider
import CreatorContextProvider from './CreatorContext';

function Creator({ match }: { match: any }) {
  const { path } = match;

  return (
    <CreatorContextProvider>
      <Switch>
        <Route exact path={`${path}`} component={ListEditions} />
        <Route path={`${path}/edition/new`} component={NewEditionForm} />
        <Route path={`${path}/edition/edit/:id`} component={EditEditionForm} />
        <Route path={`${path}/edition/publish/:id`} component={PublishEdition} />
        <Route path={`${path}/editions/:query`} component={EditionSearchResults} />
        <Route path={`${path}/volumes/:id`} component={ListVolumes} />
        {/* <Route path={`${path}/person/new`} component={NewPersonForm} /> */}
        <Route path={`${path}/person/edit/:id`} component={EditPersonForm} />
        <Route path={`${path}/profile`} component={MyProfile} />
        <Route path={`${path}/wallets/:id`} component={ListWallets} />
        <Route path={`${path}/wallet/new/:id`} component={NewWalletForm} />
        <Route path={`${path}/transactions`} component={WalletTransactions} />
      </Switch>
    </CreatorContextProvider>
  );
}

export { Creator };

import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './edition/NewEdition';
import { EditEditionForm } from './edition/EditEdition';
import { ListEditions } from './edition/ListEditions';
import { ListVolumes } from './volume/ListVolumes';
import { PublishEdition } from './edition/PublishEdition';
import { EditionSearchResults } from './edition/EditionSearchResults';
// import { NewWalletForm } from './wallet/NewWallet';
import { EditWalletForm } from './wallet/EditWallet';
import { MyProfile } from './profile/MyProfile';
import { ListWalletDetails } from './wallet/ListWalletDetails';
import { WalletTransactions } from './wallet/WalletTransactions';
import { NewWalletForm } from './wallet/NewWallet';
import { Wallet } from './wallet/Wallet';

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
        {/* <Route path={`${path}/wallet/new`} component={NewWalletForm} /> */}
        <Route path={`${path}/wallet/edit/:id`} component={EditWalletForm} />
        <Route path={`${path}/profile`} component={MyProfile} />
        <Route path={`${path}/walletdetails/:id`} component={ListWalletDetails} />
        <Route path={`${path}/wallet/new/:id`} component={NewWalletForm} />
        <Route path={`${path}/transactions`} component={WalletTransactions} />
        <Route path={`${path}/wallet`} component={Wallet} />
      </Switch>
    </CreatorContextProvider>
  );
}

export { Creator };

import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { NewEditionForm } from './edition/NewEdition';
import { EditEditionForm } from './edition/EditEdition';
import { ListEditions } from './edition/ListEditions';
import { ListVolumes } from './volume/ListVolumes';
import { PublishEdition } from './edition/PublishEdition';
import { EditionSearchResults } from './edition/EditionSearchResults';
import { EditWalletForm } from './wallet/EditWallet';
import { MyProfile } from './profile/MyProfile';
import { ShowWalletDetails } from './wallet/ShowWalletDetails';
import { WalletTransactions } from './wallet/WalletTransactions';
import { Wallet } from './wallet/Wallet';

// shared context provider
import CreatorContextProvider from './CreatorContext';

function Creator({ match }: { match: any }) {
  const { path } = match;

  return (
    <CreatorContextProvider>
      <div className="container-fluid">
        <Switch>
          <Route exact path={`${path}`} component={ListEditions} />
          <Route path={`${path}/edition/new`} component={NewEditionForm} />
          <Route path={`${path}/edition/edit/:id`} component={EditEditionForm} />
          <Route path={`${path}/edition/publish/:id`} component={PublishEdition} />
          <Route path={`${path}/editions/:query`} component={EditionSearchResults} />
          <Route path={`${path}/volumes/:id`} component={ListVolumes} />
          <Route path={`${path}/wallet/edit/:id`} component={EditWalletForm} />
          <Route path={`${path}/profile`} component={MyProfile} />
          <Route path={`${path}/wallet/:id`} component={ShowWalletDetails} />
          <Route path={`${path}/transactions`} component={WalletTransactions} />
          {/* <Route path={`${path}/wallet`} component={Wallet} /> */}
        </Switch>
      </div>
    </CreatorContextProvider>
  );
}

export { Creator };

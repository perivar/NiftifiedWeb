import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { niftyService, alertService } from '../../_services';
import { AddWalletModal } from './AddWalletModal';
import { Status } from '../../_common/enums';
import { useCreatorContext } from '../CreatorContext';

import './AddCreatorsField.scss';

export interface Wallet {
  id: number;
  created: string;
  updated: string;
  alias: string;
  status: Status;
  account: any;
  accountId: number;
  isAnonymous: boolean;
  isConfirmed: boolean;
  [key: string]: any;
}

export interface Owner {
  id: number;
  alias: string;
  status: Status;
}

const ENTER_KEY = 13;

export const AddOwnerField = ({ field, form }: FieldProps) => {
  // const user = accountService.userValue;

  // local state
  // const [isLoading, setLoading] = useState<boolean>(false);
  // const [walletOptions, setWalletOptions] = useState<any>([]); // the full list of wallets
  const {
    walletOptions,
    setWalletOptions,
    isLoadingWalletOptions: isLoading,
    setLoadingWalletOptions: setLoading,
    fetchWallets
  } = useCreatorContext();
  const [filteredWallets, setFilteredWallets] = useState<any>([]); // the filtered list when searching
  const [owner, setOwner] = useState<Owner | null>(null); // the owner
  const [searchValue, setSearchValue] = useState<string>('');
  const [showAddWalletModal, setShowAddWalletModal] = useState<boolean>(false);

  const updateValue = (owner: Owner | null) => {
    // set values
    setOwner(owner);

    // and set formik fields
    form.setFieldValue(field.name, owner);
  };

  useEffect(() => {
    fetchWallets();

    if (field.value) {
      const newOwner = field.value;
      newOwner.alias = newOwner.wallet.alias;

      updateValue(newOwner);
    }
  }, []);

  const getMatchedWalletsList = (searchText: string | undefined) => {
    if (searchText && searchText !== '') {
      if (searchText === '*') {
        return walletOptions;
      }
      return walletOptions.filter((p: any) => p.alias.toLowerCase().includes(searchText.toLowerCase()));
    }
    return [];
  };

  const onSearchChange = (event: any) => {
    setSearchValue(event.target.value);
    // instant search
    setFilteredWallets(getMatchedWalletsList(event.target.value));
  };

  const onSearchKeyPress = (event: any) => {
    const isEnterPressed = event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed) {
      setFilteredWallets(getMatchedWalletsList(searchValue));
      event.preventDefault(); // make sure the form isn't submitted as well
    }
  };

  const onSearchBlur = () => {
    setFilteredWallets(getMatchedWalletsList(searchValue));
  };

  const onCloseSearch = () => {
    setSearchValue('');
    setFilteredWallets(getMatchedWalletsList(''));
  };

  const onAdd = (id: any) => {
    // add from option list to selected wallet
    const wallet = walletOptions.find((p: any) => p.id === id);
    updateValue(wallet);

    // close the search box since we only add one owner
    setSearchValue('');
    setFilteredWallets(getMatchedWalletsList(''));
  };

  const onRemove = (id: any) => {
    // remove selected owner
    updateValue(null);
  };

  const onCreateWalletSuccess = (wallet: any) => {
    // reload and add to selected list
    setLoading(true);
    const { id } = wallet;

    niftyService
      .getWalletsByAccountId()
      .then((res) => {
        setWalletOptions(res);
        setLoading(false);

        // add from result list to selected wallet list
        // have to use res since the wallet option list isn't yet loaded
        const wallet = res.find((p: any) => p.id === id);
        updateValue(wallet);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onCreateWalletFailure = (error: any) => {
    console.log(error);
    alertService.error(error, { autoClose: false });
  };

  return (
    <>
      <div className="container-fluid p-0">
        <small id="addWalletHelpBlock1" className="form-text text-muted">
          Search here for wallets you have already added (use * to show all)
        </small>
        <div className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Find ..."
            aria-label="Find"
            value={searchValue}
            onChange={onSearchChange}
            onKeyPress={onSearchKeyPress}
            onBlur={onSearchBlur}
          />
          {!isLoading && filteredWallets && filteredWallets.length > 0 && (
            <table className="table table-sm table-dark">
              <thead className="thead">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">
                    Confirmed
                  </th>
                  {/* <th scope="col">Type</th> */}
                  <th scope="col">Add</th>
                  <th scope="col" className="text-right">
                    <button type="button" tabIndex={-1} className="is-icon-button mr-1" onClick={() => onCloseSearch()}>
                      <i className="fas fa-window-close icon-close"></i>
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredWallets.map((wallet: any) => (
                  <tr key={wallet.id}>
                    <td>{wallet.id}</td>
                    <td>{wallet.alias}</td>
                    <td>{Status[wallet.status]}</td>
                    <td className="text-center">
                      {wallet.isConfirmed ? <i className="fas fa-certificate icon-confirmed"></i> : 'No'}
                    </td>
                    {/* <td>{WalletType[wallet.type]}</td> */}
                    <td>
                      <button type="button" className="btn btn-sm btn-success" onClick={() => onAdd(wallet.id)}>
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <AddWalletModal
          show={showAddWalletModal}
          setShow={setShowAddWalletModal}
          onSuccess={onCreateWalletSuccess}
          onFailure={onCreateWalletFailure}
        />
        <div className="mt-2">
          <div>
            <table className="table table-sm table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-center">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && owner && (
                  <tr key={owner.id}>
                    <td className="align-middle">{owner.id}</td>
                    <td className="align-middle">{owner.alias}</td>
                    <td className="align-middle">{Status[owner.status]}</td>
                    <td className="text-center align-middle">
                      <button
                        type="button"
                        tabIndex={-1}
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => onRemove(owner.id)}>
                        <i className="fas fa-user-minus"></i>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <small id="addWalletHelpBlock2" className="form-text text-muted">
              Add new wallet here if you don't find the wallet you are looking when searching.
            </small>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddWalletModal(true)}>
              Add New Wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

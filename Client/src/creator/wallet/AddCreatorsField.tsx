import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { niftyService, alertService } from '../../_services';
import { AddWalletModal } from './AddWalletModal';
import { Status, creatorTypeOptions, CreatorType } from '../../_common/enums';
import Select from 'react-select';
import { useCreatorContext } from '../CreatorContext';

import './AddCreatorsField.scss';
import CustomSelect from '../../_common/select/CustomSelect';

export interface Creator {
  walletId: number;
  editionId: number;
  alias: string;
  type: CreatorType;
  salesCommissionShare: number;
  [key: string]: any;
}

const ENTER_KEY = 13;
const COMMA_KEY = 44;
const DOT_KEY = 46;

export const AddCreatorsField = ({ field, form }: FieldProps) => {
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
  const [creators, setCreators] = useState<Creator[]>([]); // the final list of wallets
  const [creatorsCommissionSum, setCreatorsCommissionSum] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showAddWalletModal, setShowAddWalletModal] = useState<boolean>(false);

  const updateValues = (values: Creator[]) => {
    // calculate total commission sum
    const commissionSum = calculateCommissionSum(values);

    // set local values
    setCreators(values);
    setCreatorsCommissionSum(commissionSum);

    // and set formik fields
    form.setFieldValue(field.name, values);
    form.setFieldValue(`${field.name}CommissionSum`, commissionSum);
  };

  useEffect(() => {
    fetchWallets();

    if (field.value) {
      const newCreators = field.value;

      // add the alias to the main object
      newCreators.forEach((cre: any) => {
        cre.alias = cre.wallet.alias;
      });

      updateValues(newCreators);
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

  const checkIfCreatorExists = (creators: Creator[], id: any) => {
    return creators.some((item: Creator) => {
      return item.walletId === id;
    });
  };

  const calculateCommissionSum = (creators: Creator[]) => {
    return creators.reduce((prev: any, p: Creator) => prev + p.salesCommissionShare, 0);
  };

  const updateCreator = (walletId: number, itemAttributes: any) => {
    const index = creators.findIndex((c: Creator) => c.walletId === walletId);
    if (index === -1) {
      // handle error
      console.log(`Creator with the walletid ${walletId} cannot be found`);
    } else {
      const newCreators = [
        ...creators.slice(0, index),
        { ...creators[index], ...itemAttributes },
        ...creators.slice(index + 1)
      ];

      updateValues(newCreators);
    }
  };

  // const handleNumberKeypress = (event: any) => {
  //   const isComma = event.which === COMMA_KEY || event.keyCode === COMMA_KEY;
  //   const isDot = event.which === DOT_KEY || event.keyCode === DOT_KEY;
  // };

  const onAdd = (id: any) => {
    // add from option list to selected wallet list
    const wallet = walletOptions.find((p: any) => p.id === id);
    if (wallet && !checkIfCreatorExists(creators, id)) {
      const creator: Creator = {
        walletId: wallet.id,
        editionId: 0,
        alias: wallet.alias,
        type: CreatorType.Creator,
        salesCommissionShare: 100
      };

      // check if creators is non empty, and not changed
      const tmpCreators = creators;
      // if (creators.length > 0) {
      //   // check if the previous commissions are split evenly?
      //   const commissionShare = 100 / creators.length;
      //   const isSplitEvenly = creators.every((creator) => {
      //     return creator.salesCommissionShare === commissionShare;
      //   });
      //   if (isSplitEvenly) {
      //     // split the commission across the creators
      //     const newCommissionShare = Math.floor(100 / (creators.length + 1));
      //     tmpCreators = creators.map((creator) => {
      //       creator.salesCommissionShare = newCommissionShare;
      //       return creator;
      //     });

      //     // and update the newly added
      //     creator.salesCommissionShare = newCommissionShare;
      //   }
      // }

      const newCreators = [...tmpCreators, creator];

      updateValues(newCreators);
    }
  };

  const onRemove = (id: any) => {
    // remove from selected creators list
    const newCreators = creators.filter((p: Creator) => p.walletId !== id);
    if (newCreators) {
      updateValues(newCreators);
    }
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
        if (wallet && !checkIfCreatorExists(creators, id)) {
          const creator: Creator = {
            walletId: wallet.id,
            editionId: 0,
            alias: wallet.alias,
            type: CreatorType.Creator,
            salesCommissionShare: 100
          };

          const newCreators = [...creators, creator];

          updateValues(newCreators);
        }
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
          Lookup wallets you have already added (use * to show all)
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
                  {/* <th scope="col">Status</th> */}
                  <th scope="col" className="w-50">
                    Type
                  </th>
                  {/* <th scope="col" className="text-center">
                    Anonymous
                  </th> */}
                  <th scope="col" className="text-center w-25">
                    Share
                  </th>
                  <th scope="col" className="text-center">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  creators &&
                  creators.map((creator: Creator) => (
                    <tr key={creator.walletId}>
                      <td className="align-middle">{creator.walletId}</td>
                      <td className="align-middle">{creator.alias}</td>
                      {/* <td>{Status[wallet.status]}</td> */}
                      <td className="align-middle">
                        <CustomSelect
                          name="type"
                          options={creatorTypeOptions}
                          defaultValue={{ label: CreatorType[creator.type], value: creator.type }}
                          onChange={(value: any) => {
                            updateCreator(creator.walletId, { type: Number(value?.value) });
                          }}
                        />
                      </td>
                      {/* <td className="text-center">
                        {wallet.isAnonymous ? <i className="fas fa-user-secret"></i> : 'Open'}
                      </td> */}
                      <td className="align-middle">
                        <input
                          className="form-control"
                          name="salesCommissionShare"
                          defaultValue={creator.salesCommissionShare}
                          type="number"
                          // onKeyPress={handleNumberKeypress}
                          onChange={(event) =>
                            updateCreator(creator.walletId, { salesCommissionShare: Number(event.target.value) })
                          }
                        />
                      </td>
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          tabIndex={-1}
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onRemove(creator.walletId)}>
                          <i className="fas fa-user-minus"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                {!isLoading && creators && (
                  <tr>
                    <td colSpan={3} className="text-right">
                      <small className="text-muted">Total commission (must be 100)</small>
                    </td>
                    <td
                      className={`text-center ${
                        creatorsCommissionSum < 100 || creatorsCommissionSum > 100 ? 'is-invalid' : ''
                      }`}>
                      <small>
                        <strong>{creatorsCommissionSum}</strong>
                      </small>
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
            <small id="addWalletHelpBlock2" className="form-text text-muted">
              Add a new wallet here if you cannot find the wallet you are looking for when searching.
            </small>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddWalletModal(true)}>
              New Wallet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { niftyService, alertService } from '../../_services';
import { AddPersonModal } from './AddPersonModal';
import { Status } from '../../_common/enums';
import { useCreatorContext } from '../CreatorContext';

import './AddCreatorsField.scss';

export interface Person {
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
  // const [personOptions, setPersonOptions] = useState<any>([]); // the full list of persons
  const {
    personOptions,
    setPersonOptions,
    isLoadingPersonOptions: isLoading,
    setLoadingPersonOptions: setLoading,
    fetchPersons
  } = useCreatorContext();
  const [filteredPersons, setFilteredPersons] = useState<any>([]); // the filtered list when searching
  const [owner, setOwner] = useState<Owner | null>(null); // the owner
  const [searchValue, setSearchValue] = useState<string>('');
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);

  const updateValue = (owner: Owner | null) => {
    // set values
    setOwner(owner);

    // and set formik fields
    form.setFieldValue(field.name, owner);
  };

  useEffect(() => {
    fetchPersons();

    if (field.value) {
      const newOwner = field.value;
      newOwner.alias = newOwner.person.alias;

      updateValue(newOwner);
    }
  }, []);

  const getMatchedPersonsList = (searchText: string | undefined) => {
    if (searchText && searchText !== '') {
      if (searchText === '*') {
        return personOptions;
      }
      return personOptions.filter((p: any) => p.alias.toLowerCase().includes(searchText.toLowerCase()));
    }
    return [];
  };

  const onSearchChange = (event: any) => {
    setSearchValue(event.target.value);
    // instant search
    setFilteredPersons(getMatchedPersonsList(event.target.value));
  };

  const onSearchKeyPress = (event: any) => {
    const isEnterPressed = event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed) {
      setFilteredPersons(getMatchedPersonsList(searchValue));
      event.preventDefault(); // make sure the form isn't submitted as well
    }
  };

  const onSearchBlur = () => {
    setFilteredPersons(getMatchedPersonsList(searchValue));
  };

  const onCloseSearch = () => {
    setSearchValue('');
    setFilteredPersons(getMatchedPersonsList(''));
  };

  const onAdd = (id: any) => {
    // add from option list to selected person
    const person = personOptions.find((p: any) => p.id === id);
    updateValue(person);

    // close the search box since we only add one owner
    setSearchValue('');
    setFilteredPersons(getMatchedPersonsList(''));
  };

  const onRemove = (id: any) => {
    // remove selected owner
    updateValue(null);
  };

  const onCreatePersonSuccess = (person: any) => {
    // reload and add to selected list
    setLoading(true);
    const { id } = person;

    niftyService
      .getPersonsByAccountId()
      .then((res) => {
        setPersonOptions(res);
        setLoading(false);

        // add from result list to selected person list
        // have to use res since the person option list isn't yet loaded
        const person = res.find((p: any) => p.id === id);
        updateValue(person);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const onCreatePersonFailure = (error: any) => {
    console.log(error);
    alertService.error(error, { autoClose: false });
  };

  return (
    <>
      <div className="container">
        <small id="addPersonHelpBlock1" className="form-text text-muted">
          Search here for persons you have already added (use * to show all)
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
          {!isLoading && filteredPersons && filteredPersons.length > 0 && (
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
                {filteredPersons.map((person: any) => (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.alias}</td>
                    <td>{Status[person.status]}</td>
                    <td className="text-center">
                      {person.isConfirmed ? <i className="fas fa-certificate icon-confirmed"></i> : 'No'}
                    </td>
                    {/* <td>{PersonType[person.type]}</td> */}
                    <td>
                      <button type="button" className="btn btn-sm btn-success" onClick={() => onAdd(person.id)}>
                        Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <AddPersonModal
          show={showAddPersonModal}
          setShow={setShowAddPersonModal}
          onSuccess={onCreatePersonSuccess}
          onFailure={onCreatePersonFailure}
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
            <small id="addPersonHelpBlock2" className="form-text text-muted">
              Add new person here if you don't find the person you are looking when searching.
            </small>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddPersonModal(true)}>
              Add New Person
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { accountService, niftyService } from '../../_services';
import { Status, PersonType } from '../person/NewPerson';
import { AddPersonModal } from './AddPersonModal';

import './AddPersonField.scss';

const ENTER_KEY = 13;

export const AddPersonsField = ({ field, form }: FieldProps) => {
  const user = accountService.userValue;

  // formik values
  const hasError = form.touched[field.name] && form.errors[field.name];

  // local state
  const [isLoading, setLoading] = useState<boolean>(false);
  const [personOptions, setPersonOptions] = useState<any>([]); // the full list of persons
  const [persons, setPersons] = useState<any>([]); // the final list of persons
  const [filteredPersons, setFilteredPersons] = useState<any>([]); // the filtered list when searching
  const [inEditMode, setInEditMode] = useState<{ status: boolean; rowKey: any }>({
    status: false,
    rowKey: null
  });

  const [searchText, setSearchText] = useState<string>();

  const [salesCommisionShare, setSalesCommisionShare] = useState<string | null>(null);

  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);

  // load all person options async
  const fetchPersons = () => {
    setLoading(true);

    niftyService
      .getPersonsByAccountId()
      .then((res) => {
        setPersonOptions(res);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPersons();
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

  const onEdit = ({ id, currentSalesCommisionShare }: { id: number; currentSalesCommisionShare: string }) => {
    setInEditMode({
      status: true,
      rowKey: id
    });
    setSalesCommisionShare(currentSalesCommisionShare);
  };

  const updatePerson = ({ id, newSalesCommisionShare }: { id: number; newSalesCommisionShare: string }) => {
    // reset inEditMode and values
    // onCancel();
    // fetch the updated data
    // fetchPersons();
  };

  const onSave = ({ id, newSalesCommisionShare }: { id: number; newSalesCommisionShare: any }) => {
    updatePerson({ id, newSalesCommisionShare });
  };

  const onCancel = () => {
    // reset the inEditMode state value
    setInEditMode({
      status: false,
      rowKey: null
    });
    // reset the unit price state value
    setSalesCommisionShare(null);
  };

  const onChange = (event: any) => {
    setSearchText(event.target.value);
    // instant search
    setFilteredPersons(getMatchedPersonsList(event.target.value));
  };

  const onEnter = (event: any) => {
    const isEnterPressed = event.which === ENTER_KEY || event.keyCode === ENTER_KEY;
    if (isEnterPressed) {
      setFilteredPersons(getMatchedPersonsList(searchText));
      event.preventDefault(); // make sure the form isn't submitted as well
    }
  };

  const onCloseSearch = () => {
    setSearchText('');
    setFilteredPersons(getMatchedPersonsList(''));
  };

  const onBlur = () => {
    setFilteredPersons(getMatchedPersonsList(searchText));
  };

  const checkIfExists = (items: any, itemId: any) => {
    return items.some((item: any) => {
      return item.id === itemId;
    });
  };

  const onAdd = (id: any) => {
    // add from option list to selected person list
    const person = personOptions.find((p: any) => p.id === id);
    if (person && !checkIfExists(persons, id)) {
      setPersons([...persons, person]);
    }
  };

  const onRemove = (id: any) => {
    // remove from selected person list
    const newPersonList = persons.filter((p: any) => p.id !== id);
    if (newPersonList) {
      setPersons([...newPersonList]);
    }
  };

  const onFormSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="container">
        <small id="addPersonHelpBlock1" className="form-text text-muted">
          Search here if you already have a person you want to add
        </small>
        <form className="form-inline my-2 my-lg-0" noValidate onSubmit={onFormSubmit}>
          <input
            className="form-control-sm mr-sm-2"
            type="search"
            placeholder="Find ..."
            aria-label="Find"
            value={searchText}
            onChange={onChange}
            onKeyPress={onEnter}
            onBlur={onBlur}
          />
          {!isLoading && filteredPersons && filteredPersons.length > 0 && (
            <table className="table table-sm table-dark">
              <thead className="thead">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Status</th>
                  <th scope="col">Type</th>
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
                    <td>{PersonType[person.type]}</td>
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
        </form>
        <AddPersonModal show={showAddPersonModal} setShow={setShowAddPersonModal} />
        <form noValidate onSubmit={onFormSubmit} className="mt-2">
          <div className="table-responsive">
            <table className="table table-sm table-bordered">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Alias</th>
                  <th scope="col">Status</th>
                  <th scope="col">Type</th>
                  <th scope="col" className="text-center">
                    Anonymous
                  </th>
                  <th scope="col" className="text-center">
                    Commision
                  </th>
                  <th scope="col" className="text-center">
                    Edit
                  </th>
                  <th scope="col" className="text-center">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  persons &&
                  persons.map((person: any) => (
                    <tr key={person.id}>
                      <td>{person.id}</td>
                      <td>{person.alias}</td>
                      <td>{Status[person.status]}</td>
                      <td>{PersonType[person.type]}</td>
                      <td className="text-center">
                        {person.isAnonymous ? <i className="fas fa-user-secret"></i> : 'Open'}
                      </td>
                      <td className="text-center" style={{ width: '80px' }}>
                        {inEditMode.status && inEditMode.rowKey === person.id ? (
                          <input
                            className="form-control-inline"
                            value={person.salesCommisionShare}
                            onChange={(event) => setSalesCommisionShare(event.target.value)}
                          />
                        ) : (
                          person.salesCommisionShare
                        )}
                      </td>
                      <td className="text-nowrap text-center">
                        {inEditMode.status && inEditMode.rowKey === person.id ? (
                          <>
                            <button
                              type="button"
                              className="is-icon-button mr-1"
                              onClick={() => onSave({ id: person.id, newSalesCommisionShare: salesCommisionShare })}>
                              <i className="fas fa-cloud-upload-alt icon-save"></i>
                            </button>
                            <button type="button" className="is-icon-button" onClick={() => onCancel()}>
                              <i className="fas fa-window-close icon-cancel"></i>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="is-icon-button"
                            onClick={() =>
                              onEdit({ id: person.id, currentSalesCommisionShare: person.salesCommisionShare })
                            }>
                            <i className="fas fa-pencil-alt icon-edit"></i>
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        <button type="button" className="is-icon-button" onClick={() => onRemove(person.id)}>
                          <i className="fas fa-trash-alt icon-remove"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <small id="addPersonHelpBlock2" className="form-text text-muted">
              If you don't find the persons among the existing persons, add them here.
            </small>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => setShowAddPersonModal(true)}>
              Add New Person
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

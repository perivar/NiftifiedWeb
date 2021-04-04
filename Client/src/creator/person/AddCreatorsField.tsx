import React, { useEffect, useState } from 'react';
import { FieldProps } from 'formik';
import { niftyService, alertService } from '../../_services';
import { AddPersonModal } from './AddPersonModal';
import { Status, creatorTypeOptions, CreatorType } from '../../_common/enums';
import Select from 'react-select';
import { useCreatorContext } from '../CreatorContext';

import './AddCreatorsField.scss';
import CustomSelect from '../../_common/select/CustomSelect';

export interface Creator {
  personId: number;
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
  // const [personOptions, setPersonOptions] = useState<any>([]); // the full list of persons
  const {
    personOptions,
    setPersonOptions,
    isLoadingPersonOptions: isLoading,
    setLoadingPersonOptions: setLoading,
    fetchPersons
  } = useCreatorContext();
  const [filteredPersons, setFilteredPersons] = useState<any>([]); // the filtered list when searching
  const [creators, setCreators] = useState<Creator[]>([]); // the final list of persons
  const [creatorsCommissionSum, setCreatorsCommissionSum] = useState<number>(0);
  const [searchValue, setSearchValue] = useState<string>('');
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);

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
    fetchPersons();

    if (field.value) {
      const newCreators = field.value;

      // add the alias to the main object
      newCreators.forEach((cre: any) => {
        cre.alias = cre.person.alias;
      });

      updateValues(newCreators);
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

  const checkIfCreatorExists = (creators: Creator[], id: any) => {
    return creators.some((item: Creator) => {
      return item.personId === id;
    });
  };

  const calculateCommissionSum = (creators: Creator[]) => {
    return creators.reduce((prev: any, p: Creator) => prev + p.salesCommissionShare, 0);
  };

  const updateCreator = (personId: number, itemAttributes: any) => {
    const index = creators.findIndex((c: Creator) => c.personId === personId);
    if (index === -1) {
      // handle error
      console.log(`Creator with the personid ${personId} cannot be found`);
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
    // add from option list to selected person list
    const person = personOptions.find((p: any) => p.id === id);
    if (person && !checkIfCreatorExists(creators, id)) {
      const creator: Creator = {
        personId: person.id,
        editionId: 0,
        alias: person.alias,
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
    const newCreators = creators.filter((p: Creator) => p.personId !== id);
    if (newCreators) {
      updateValues(newCreators);
    }
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
        if (person && !checkIfCreatorExists(creators, id)) {
          const creator: Creator = {
            personId: person.id,
            editionId: 0,
            alias: person.alias,
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
                    <tr key={creator.personId}>
                      <td className="align-middle">{creator.personId}</td>
                      <td className="align-middle">{creator.alias}</td>
                      {/* <td>{Status[person.status]}</td> */}
                      <td className="align-middle">
                        <CustomSelect
                          name="type"
                          options={creatorTypeOptions}
                          defaultValue={{ label: CreatorType[creator.type], value: creator.type }}
                          onChange={(value: any) => {
                            updateCreator(creator.personId, { type: Number(value?.value) });
                          }}
                        />
                      </td>
                      {/* <td className="text-center">
                        {person.isAnonymous ? <i className="fas fa-user-secret"></i> : 'Open'}
                      </td> */}
                      <td className="align-middle">
                        <input
                          className="form-control"
                          name="salesCommissionShare"
                          defaultValue={creator.salesCommissionShare}
                          type="number"
                          // onKeyPress={handleNumberKeypress}
                          onChange={(event) =>
                            updateCreator(creator.personId, { salesCommissionShare: Number(event.target.value) })
                          }
                        />
                      </td>
                      <td className="text-center align-middle">
                        <button
                          type="button"
                          tabIndex={-1}
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => onRemove(creator.personId)}>
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

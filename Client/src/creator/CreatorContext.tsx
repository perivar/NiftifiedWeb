import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { niftyService } from '../_services';

export interface CreatorContextData {
  personOptions: any[];
  setPersonOptions: (value: any) => void;
  isLoadingPersonOptions: boolean;
  setLoadingPersonOptions: (value: boolean) => void;
  fetchPersons: () => void;
}

// create the global context
export const CreatorContext = createContext<CreatorContextData | undefined>(undefined);

// hook to use in the children
export const useCreatorContext = () => {
  const creatorContext = useContext(CreatorContext);
  if (!creatorContext) {
    throw new Error('useCreatorContext must be used within the CreatorContext.Provider');
  }
  return creatorContext;
};

// implement the values as a facade pattern
// see https://wanago.io/2020/09/28/react-context-api-hooks-typescript/
const useCreatorContextValue = (): CreatorContextData => {
  // global state variables
  const [personOptions, setPersonOptions] = useState<any>(null); // the full list of persons
  const [isLoadingPersonOptions, setLoadingPersonOptions] = useState<boolean>(false);

  // load all person options async
  const fetchPersons = useCallback(() => {
    setLoadingPersonOptions(true);

    niftyService
      .getPersonsByAccountId()
      .then((res) => {
        setPersonOptions(res);
        setLoadingPersonOptions(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingPersonOptions(false);
      });
  }, [setPersonOptions]);

  return useMemo(
    () => ({
      personOptions,
      setPersonOptions,
      isLoadingPersonOptions,
      setLoadingPersonOptions,
      fetchPersons
    }),
    [personOptions, setPersonOptions, isLoadingPersonOptions, setLoadingPersonOptions, fetchPersons]
  );
};

const CreatorContextProvider = (props: any) => {
  const creatorContextValue = useCreatorContextValue();

  return <CreatorContext.Provider value={creatorContextValue}>{props.children}</CreatorContext.Provider>;
};

export default CreatorContextProvider;

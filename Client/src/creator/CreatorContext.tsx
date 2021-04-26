import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { niftyService } from '../_services';

export interface CreatorContextData {
  walletOptions: any[];
  setWalletOptions: (value: any) => void;
  isLoadingWalletOptions: boolean;
  setLoadingWalletOptions: (value: boolean) => void;
  fetchWallets: () => void;
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
  const [walletOptions, setWalletOptions] = useState<any>(null); // the full list of wallets
  const [isLoadingWalletOptions, setLoadingWalletOptions] = useState<boolean>(false);

  // load all wallet options async
  const fetchWallets = useCallback(() => {
    setLoadingWalletOptions(true);

    niftyService
      .getWalletsByAccountId()
      .then((res) => {
        setWalletOptions(res);
        setLoadingWalletOptions(false);
      })
      .catch((error) => {
        console.log(error);
        setLoadingWalletOptions(false);
      });
  }, [setWalletOptions]);

  return useMemo(
    () => ({
      walletOptions,
      setWalletOptions,
      isLoadingWalletOptions,
      setLoadingWalletOptions,
      fetchWallets
    }),
    [walletOptions, setWalletOptions, isLoadingWalletOptions, setLoadingWalletOptions, fetchWallets]
  );
};

const CreatorContextProvider = (props: any) => {
  const creatorContextValue = useCreatorContextValue();

  return <CreatorContext.Provider value={creatorContextValue}>{props.children}</CreatorContext.Provider>;
};

export default CreatorContextProvider;

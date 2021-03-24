import { ToOptionArray } from './optionUtils';

export enum CreatorType {
  Creator,
  CoCreator,
  Publisher,
  Producer,
  Other
}

export enum Status {
  Pending,
  Active,
  Cancelled,
  Expired
}

export enum WalletType {
  Nifty,
  Other
}

export const statusOptions = ToOptionArray(Status);
export const creatorTypeOptions = ToOptionArray(CreatorType);

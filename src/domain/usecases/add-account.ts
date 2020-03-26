import { AccountModel } from "../models/account";

export interface AddAccountModel {
  name: string;
  email: string;
  password: string;
}

export interface AddAcount {
  add(account: AddAccountModel): Promise<AccountModel>;
}

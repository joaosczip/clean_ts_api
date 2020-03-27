import {
  AddAccountModel,
  AddAcount,
  AccountModel,
  Encrypter
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAcount {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise(resolve => resolve(null));
  }
}

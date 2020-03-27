import {
  AddAccountModel,
  AddAcount,
  AccountModel,
  Encrypter,
  AddAccountRepository
} from "./db-add-account-protocols";

export class DbAddAccount implements AddAcount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor(
    encrypter: Encrypter,
    addAccountRepository: AddAccountRepository
  ) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword
    });
    return new Promise(resolve => resolve(null));
  }
}

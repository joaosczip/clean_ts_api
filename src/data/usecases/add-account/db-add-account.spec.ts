import { DbAddAccount } from "./db-add-account";
import { Encrypter } from "../../protocols/encrypter";
import { AddAccountModel } from "../../../domain/usecases/add-account";
import { AccountModel } from "../../../domain/models/account";
import { AddAccountRepository } from "../../protocols/add-account-repository";

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve =>
        resolve({
          id: "id",
          name: "name",
          email: "email@email",
          password: "hashed_password"
        })
      );
    }
  }

  return new AddAccountRepositoryStub();
};

const makeEncryptper = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"));
    }
  }

  return new EncrypterStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountRespositoryStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncryptper();
  const addAccountRespositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRespositoryStub);

  return { sut, encrypterStub, addAccountRespositoryStub };
};

describe("DbAddAccount Usecase", () => {
  it("should call Encrypter with correct password", async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith("valid_password");
  });
  it("should throw if Encrypter throws", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };

    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });
  it("should call AddAccountRespository with correct values", async () => {
    const { sut, addAccountRespositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRespositoryStub, "add");
    const accountData = {
      name: "valid_name",
      email: "valid_email",
      password: "valid_password"
    };

    await sut.add(accountData);
    expect(addSpy).toHaveBeenCalledWith({
      name: "valid_name",
      email: "valid_email",
      password: "hashed_password"
    });
  });
});

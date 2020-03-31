import SignUpController from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import LogControllerDecorator from "../decorators/log";
import { Controller } from "../../presentation/protocols";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const repository = new AccountMongoRepository();
  const addAccount = new DbAddAccount(encrypter, repository);
  const signUp = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signUp);
};

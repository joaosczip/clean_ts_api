import SignUpController from "../../presentation/controllers/signup/signup";
import { EmailValidatorAdapter } from "../../utils/email-validator-adapter";
import { DbAddAccount } from "../../data/usecases/add-account/db-add-account";
import { BcryptAdapter } from "../../infra/criptography/bcrypt-adapter";
import { AccountMongoRepository } from "../../infra/db/mongodb/account-repository/account";
import { LogMongoRepository } from "../../infra/db/mongodb/log-repository/log";
import LogControllerDecorator from "../decorators/log";
import { Controller } from "../../presentation/protocols";

export const makeSignUpController = (): Controller => {
  const salt = 12;
  const emailValidator = new EmailValidatorAdapter();
  const encrypter = new BcryptAdapter(salt);
  const accountRepository = new AccountMongoRepository();
  const logRepository = new LogMongoRepository();
  const addAccount = new DbAddAccount(encrypter, accountRepository);
  const signUp = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signUp, logRepository);
};

import SignUpController from "./signup";
import {
  HttpRequest,
  EmailValidator,
  AddAccountModel,
  AddAcount,
  AccountModel
} from "./signup-protocols";
import {
  MissingParamError,
  InvalidParamError,
  ServerError
} from "../../errors";

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

const makeAddAccount = (): AddAcount => {
  class AddAcountStub implements AddAcount {
    async add(account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "id",
        name: "name",
        email: "email@email.com",
        password: "password"
      };
      return new Promise(resolve => resolve(fakeAccount));
    }
  }

  return new AddAcountStub();
};

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAcount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SignUpController(emailValidatorStub, addAccountStub);

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  };
};

describe("SignUp Controller", () => {
  it("should return 400 if no name if provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  it("should return 400 if no email if provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        password: "password",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  it("should return 400 if no password if provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  it("should return 400 if no password confirmation if provided", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
  it("should return 400 if password confirmation fails", async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "invalid"
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError("passwordConfirmation")
    );
  });
  it("should return 400 if an invalid email is provided", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockReturnValueOnce(false);
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "invalid_email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError("email"));
  });
  it("should call EmailValidator with correct email", () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, "isValid");
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith("email@email.com");
  });
  it("should return 500 if EmailValidator throws", async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, "isValid").mockImplementationOnce(() => {
      throw new ServerError();
    });

    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  it("should call AddAccount with correct values", () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add");
    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "name",
      email: "email@email.com",
      password: "password"
    });
  });
  it("should return 500 if AddAccount throws", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new ServerError()));
    });

    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  it("should return 200 if valid data is provided", async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: "id",
      name: "name",
      email: "email@email.com",
      password: "password"
    });
  });
});

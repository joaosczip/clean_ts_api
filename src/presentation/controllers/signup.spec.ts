import SignUpController from "./signup";
import { MissingParamError, InvalidParamError, ServerError } from "../errors";
import { HttpRequest, HttpResponse } from "../protocols/http";
import { EmailValidator } from "../protocols/email-validator";

interface SutTypes {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }

  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignUpController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub
  };
};

describe("SignUp Controller", () => {
  it("should return 400 if no name if provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("name"));
  });
  it("should return 400 if no email if provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        password: "password",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("email"));
  });
  it("should return 400 if no password if provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        passwordConfirmation: "password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("password"));
  });
  it("should return 400 if no password confirmation if provided", () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password"
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError("passwordConfirmation")
    );
  });
  it("should return 400 if an invalid email is provided", () => {
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

    const httpResponse = sut.handle(httpRequest);
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
  it("should return 500 if EmailValidator throws", () => {
    class EmailValidatorStub implements EmailValidator {
      isValid(email: string): boolean {
        throw new Error();
      }
    }

    const emailValidatorStub = new EmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    const httpRequest: HttpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };

    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});

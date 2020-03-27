import { EmailValidatorAdapter } from "./email-validator";
import validator from "validator";

jest.mock("validator", () => ({
  isEmail(): boolean {
    return true;
  }
}));

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe("EmailValidatorAdapter", () => {
  it("should return false if validator returns false", () => {
    const sut = makeSut();
    jest.spyOn(validator, "isEmail").mockReturnValueOnce(false);
    const isValid = sut.isValid("email@email.com");
    expect(isValid).toBe(false);
  });
  it("should return true if validator returns true", () => {
    const sut = makeSut();
    const isValid = sut.isValid("email@email.com");
    expect(isValid).toBe(true);
  });
  it("should call validator with correct email", () => {
    const sut = makeSut();
    const validatorMock = jest.spyOn(validator, "isEmail");
    sut.isValid("email@email.com");
    expect(validatorMock).toHaveBeenCalledWith("email@email.com");
  });
});

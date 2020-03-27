import { EmailValidatorAdapter } from "./email-validator";

describe("EmailValidatorAdapter", () => {
  it("should return false if validator returns false", () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid("email@email.com");
    expect(isValid).toBe(false);
  });
});

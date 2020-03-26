import SignUpController from "./signup";
import { MissingParamError } from "../errors/missing-param-error";

describe("SignUp Controller", () => {
  it("should return 400 if no name if provided", () => {
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
    const sut = new SignUpController();
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
});

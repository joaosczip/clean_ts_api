import SignUpController from "./signup";

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
    expect(httpResponse.body).toEqual(new Error('Missing param: name'))
  });
});

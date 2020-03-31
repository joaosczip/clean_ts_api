import LogControllerDecorator from "./log";
import {
  Controller,
  HttpResponse,
  HttpRequest
} from "../../presentation/protocols";

describe("LogControllerDecorator", () => {
  it("should call controller handle", async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        return new Promise(resolve =>
          resolve({
            statusCode: 200,
            body: "success"
          })
        );
      }
    }
    const controllerStub = new ControllerStub();
    const sut = new LogControllerDecorator(controllerStub);
    const handleSpy = jest.spyOn(controllerStub, "handle");
    const httpRequest = {
      body: {
        name: "name",
        email: "email@email.com",
        password: "password",
        passwordConfirmation: "password"
      }
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});

import { Controller } from "../../presentation/protocols";
import { HttpRequest, HttpResponse } from "../../presentation/protocols";

export default class LogControllerDecorator implements Controller {
  private readonly controller: Controller;

  constructor(controller: Controller) {
    this.controller = controller;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.controller.handle(httpRequest);
    return new Promise(resolve => resolve(null));
  }
}
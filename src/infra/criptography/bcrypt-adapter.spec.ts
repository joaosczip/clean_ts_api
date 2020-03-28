import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

describe("Bcrypt Adapter", () => {
  it("should call bcrypt with correct values", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("value");
    expect(bcryptSpy).toHaveBeenCalledWith("value", salt);
  });
});

import bcrypt, { hash } from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed_value"));
  }
}));

describe("Bcrypt Adapter", () => {
  it("should call bcrypt with correct values", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("value");
    expect(bcryptSpy).toHaveBeenCalledWith("value", salt);
  });
  it("should return a hash on success", async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt("value");
    expect(hash).toBe("hashed_value");
  });
});

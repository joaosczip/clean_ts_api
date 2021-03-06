import bcrypt, { hash } from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve("hashed_value"));
  }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt);
};

describe("Bcrypt Adapter", () => {
  it("should call bcrypt with correct values", async () => {
    const sut = makeSut();
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("value");
    expect(bcryptSpy).toHaveBeenCalledWith("value", salt);
  });
  it("should return a hash on success", async () => {
    const sut = makeSut();
    const hash = await sut.encrypt("value");
    expect(hash).toBe("hashed_value");
  });
  it("should throw if bcrypt throws", async () => {
    const sut = makeSut();
    jest
      .spyOn(bcrypt, "hash")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.encrypt("value");
    await expect(promise).rejects.toThrow();
  });
});

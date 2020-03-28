import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  it("should return an account on sucess", async () => {
    const sut = new AccountMongoRepository();
    const account = await sut.add({
      name: "name",
      email: "email@email",
      password: "password"
    });
    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe("name");
    expect(account.email).toBe("email@email");
    expect(account.password).toBe("password");
  });
});

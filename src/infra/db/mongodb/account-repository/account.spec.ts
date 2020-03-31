import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account";

const makeSut = (): AccountMongoRepository => {
  return new AccountMongoRepository();
};

describe("Account Mongo Repository", () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  it("should return an account on sucess", async () => {
    const sut = makeSut();
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

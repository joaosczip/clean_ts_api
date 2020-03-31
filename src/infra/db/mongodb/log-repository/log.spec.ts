import { MongoHelper } from "../helpers/mongo-helper";
import { Collection } from "mongodb";
import { LogMongoRepository } from "./log";
import { LogErrorRepository } from "../../../../data/protocols/log-error-repository";

const makeSut = (): LogErrorRepository => {
  return new LogMongoRepository();
};

describe("Log Mongo Repository", () => {
  let errorCollection: Collection;
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection("errors");
    await errorCollection.deleteMany({});
  });

  it("should create an error log on success", async () => {
    const sut = makeSut();
    await sut.logError("any_error");
    const count = await errorCollection.countDocuments();
    expect(count).toBe(1);
  });
});

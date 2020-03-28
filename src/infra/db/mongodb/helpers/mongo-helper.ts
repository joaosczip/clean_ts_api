import { MongoClient } from "mongodb";
import { disconnect } from "cluster";

export const MongoHelper = {
  client: null as MongoClient,

  async connect(uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  },

  async disconnect(): Promise<void> {
    await this.client.close();
  }
};

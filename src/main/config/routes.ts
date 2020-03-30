import { Express, Router } from "express";
import fg from "fast-glob";

export default async (app: Express) => {
  const router = Router();
  app.use("/api", router);
  fg.sync("**/src/main/routes/**routes.ts").map(async file => {
    const route = (await import(`../../../${file}`)).default;
    route(router);
  });
};

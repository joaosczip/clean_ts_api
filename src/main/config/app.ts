import express from "express";
import setUpMiddlewares from "../config/middlewares";
import setUpRoutes from "../config/middlewares";

const app = express();
setUpMiddlewares(app);
setUpRoutes(app);
export default app;

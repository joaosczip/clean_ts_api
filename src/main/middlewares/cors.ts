import { Request, Response, NextFunction } from "express";

export const cors = (req: Request, res: Response, next: NextFunction): void => {
  res.set({
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "*",
    "access-control-allow-headers": "*"
  });
  next();
};

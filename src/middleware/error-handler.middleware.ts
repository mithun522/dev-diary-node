/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/custom-error.utils";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.StatusCode).json(err.serialize());
  } else {
    // Handle other errors or pass them along
    res.status(500).json({ message: "Internal Server Error" });
  }
};

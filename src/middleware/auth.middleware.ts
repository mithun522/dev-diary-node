import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../error/unauthenticated.error";
import jwt from "jsonwebtoken";
import { ForbiddenError } from "../error/forbidden.error";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "You are not authorized to access this route"
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const secretKey = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secretKey) as {
      id: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    throw new ForbiddenError("Invalid token");
  }
};

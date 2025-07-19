import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ForbiddenError } from "../error/forbidden.error";
import { UnauthenticatedError } from "../error/unauthenticated.error";
import { Roles } from "../enum/roles.enum";

export const checkRole = (requiredRole: Roles) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (token) {
      const decodedToken = jwt.decode(token);
      if (decodedToken.role === requiredRole) {
        next();
      } else {
        throw new ForbiddenError("You don't have permission");
      }
    } else {
      throw new UnauthenticatedError(
        "You are not authorized to access this route"
      );
    }
  };
};

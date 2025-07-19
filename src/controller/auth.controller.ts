import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
  authService = new AuthService();

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const login = await this.authService.login(
        req.body.email,
        req.body.password
      );
      res.json(login);
    } catch (err) {
      next(err);
    }
  }
}

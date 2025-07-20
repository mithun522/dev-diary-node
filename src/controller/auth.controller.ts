import { Request, Response, NextFunction } from "express";
import { AuthService } from "../service/auth.service";

export class AuthController {
  authService = new AuthService();

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.authService.createUser(req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

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

  async sendOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const otp = await this.authService.sendOtp(req.body.email);
      res.json(otp);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const verifiedOtp = await this.authService.verifyOtp(
        req.body.email,
        req.body.otp
      );
      res.json(verifiedOtp);
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const resetPassword = await this.authService.resetPassword(
        req.body.email,
        req.body.password
      );
      res.json(resetPassword);
    } catch (err) {
      next(err);
    }
  }
}

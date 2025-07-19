import { Request, Response, NextFunction } from "express";
import { UserService } from "../service/User.service";
import { User } from "../entity/User";

export class UserController {
  userService = new UserService();

  constructor() {}

  async getAllUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUser();
      res.json(users); // ✅ send response here
    } catch (err) {
      next(err);
    }
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.createUser(req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async getSingleUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.getSingleUser(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.userService.deleteUser(req.params.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}

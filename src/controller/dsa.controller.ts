import { Dsa } from "../entity/Dsa";
import { NextFunction, Request, AuthenticatedRequest, Response } from "express";
import { DsaService } from "../service/dsa.service";
import { UnauthenticatedError } from "../error/unauthenticated.error";

export class DsaController {
  private dsaService = new DsaService();

  async createDsa(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;

    if (!userId) throw new UnauthenticatedError("User is not authenticated");

    try {
      const dsa = await this.dsaService.createDsa(userId, req.body);
      res.json(dsa);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async getAllDsa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dsa = await this.dsaService.getAllDsa();
      res.json(dsa);
    } catch (err) {
      next(err);
    }
  }

  async getSingleDsa(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;

    if (!userId) throw new UnauthenticatedError("User is not authenticated");

    try {
      const dsa = await this.dsaService.getSingleDsa(parseInt(req.params.id));
      res.json(dsa);
    } catch (err) {
      next(err);
    }
  }

  async getDsaByUserId(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;

    if (!userId) throw new UnauthenticatedError("User is not authenticated");

    try {
      const dsa = await this.dsaService.getDsaByUserId(userId);
      res.json(dsa);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  async updateDsa(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dsa = await this.dsaService.updateDsa(
        parseInt(req.params.id),
        req.body
      );
      res.json(dsa);
    } catch (err) {
      next(err);
    }
  }

  async deleteDsa(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dsa = await this.dsaService.deleteDsa(parseInt(req.params.id));
      res.json(dsa);
    } catch (err) {
      next(err);
    }
  }
}

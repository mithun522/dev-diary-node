import { Dsa } from "../entity/Dsa";
import { NextFunction, Request, AuthenticatedRequest, Response } from "express";
import { DsaService } from "../service/dsa.service";
import { UnauthenticatedError } from "../error/unauthenticated.error";
import { DifficultyLevels } from "../enum/difficulty-levels.enum";
import { User } from "../entity/User";

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
    const { searchString, difficulty, pageNumber } = req.query as {
      searchString?: string;
      difficulty?: string;
      pageNumber: number;
    };

    if (!userId) throw new UnauthenticatedError("User is not authenticated");

    try {
      const difficultyEnum = Object.values(DifficultyLevels).includes(
        difficulty.toUpperCase() as DifficultyLevels
      )
        ? (difficulty as DifficultyLevels)
        : DifficultyLevels.NONE;

      const dsa = await this.dsaService.getDsaByUserId(
        { id: userId } as User,
        searchString || "",
        difficultyEnum,
        pageNumber
      );

      res.json(dsa);
    } catch (err) {
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

import { UnauthenticatedError } from "../error/unauthenticated.error";
import { TechInterviewService } from "../service/tech-interview.service";
import { Request, AuthenticatedRequest, Response, NextFunction } from "express";

export class TechInterviewController {
  private techInterviewService = new TechInterviewService();
  async createTechInterview(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const user = req.user?.id;

    if (!user) throw new UnauthenticatedError("User is not authenticated");
    try {
      const techInterview = await this.techInterviewService.createTechInterview(
        user,
        req.body
      );
      res.json(techInterview);
    } catch (err) {
      next(err);
      console.log(err);
    }
  }

  async getTechInterviewByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.params.id;
    try {
      const techInterview =
        await this.techInterviewService.getTechInterviewByUserId(
          parseInt(userId)
        );
      res.json(techInterview);
    } catch (err) {
      next(err);
    }
  }

  async getTechInterviewByLanguage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;
    const language = req.query.language;
    try {
      const techInterview =
        await this.techInterviewService.getTechInterviewByLanguage(
          parseInt(userId),
          language
        );
      res.json(techInterview);
    } catch (err) {
      next(err);
    }
  }

  async updateTechInterivew(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;
    const techInterviewId = req.params.id;
    try {
      const techInterview = await this.techInterviewService.updateTechInterview(
        parseInt(userId),
        parseInt(techInterviewId),
        req.body
      );
      res.json(techInterview);
    } catch (err) {
      next(err);
    }
  }

  async deleteTechInterview(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = req.user?.id;
    const techInterviewId = req.params.id;
    try {
      const techInterview = await this.techInterviewService.deleteTechInterview(
        parseInt(userId),
        parseInt(techInterviewId)
      );
      res.json(techInterview);
    } catch (err) {
      next(err);
    }
  }
}

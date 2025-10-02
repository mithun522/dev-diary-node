import { AuthenticatedRequest, Request, Response, NextFunction } from "express";
import { LanguageService } from "../service/language.service";

export class LanguageController {
  constructor(private languageService = new LanguageService()) {
    languageService = new LanguageService();
  }

  async createLanguage(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const language = await this.languageService.createLanguage(
        userId,
        req.body
      );
      res.json(language);
    } catch (err) {
      next(err);
    }
  }

  async getAllLanguages(req: Request, res: Response, next: NextFunction) {
    try {
      const languages = await this.languageService.getAllLanguages();
      res.json(languages);
    } catch (err) {
      next(err);
    }
  }

  async getSingleLanguage(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const language = await this.languageService.getSingleLanguage(id);
      res.json(language);
    } catch (err) {
      next(err);
    }
  }
}

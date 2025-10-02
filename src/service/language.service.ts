import { DeleteResult } from "typeorm";
import { LanguageEntity } from "../entity/Language";
import { ILanguageService } from "./service-interface/Ilanguage.service";
import { checkUserExists } from "../utils/user-validation.utils";
import { LanguageRepository } from "../repository/language.repo";
import { NotFoundError } from "../error/not-found.error";

export class LanguageService implements ILanguageService {
  private languageRepo: typeof LanguageRepository;

  constructor(languageRepo = LanguageRepository) {
    this.languageRepo = languageRepo;
  }

  async createLanguage(
    userId: number,
    languageData: { language: string }
  ): Promise<Partial<LanguageEntity>> {
    try {
      const user = await checkUserExists("id", userId);

      const newLanguage = this.languageRepo.create({
        language: languageData.language,
        user: user,
      });

      return await this.languageRepo.save(newLanguage);
    } catch (err) {
      throw err;
    }
  }

  async getAllLanguages(): Promise<LanguageEntity[]> {
    return await this.languageRepo.find();
  }

  async getLanguagesByUserId(userId: number): Promise<LanguageEntity[]> {
    return await this.languageRepo.find({ where: { user: { id: userId } } });
  }

  async getSingleLanguage(id: number): Promise<LanguageEntity> {
    return await this.languageRepo.findOne({ where: { id: id } });
  }

  async updateLanguage(
    userId: number,
    id: number,
    language: any
  ): Promise<Partial<LanguageEntity>> {
    try {
      const user = await checkUserExists("id", userId);

      const existingLanguage = await this.languageRepo.findOneBy({ id });
      if (!existingLanguage) throw new NotFoundError("Language not found");

      const mergeValues = {
        language: language.language,
        user: user,
      };
      const updatedValue = this.languageRepo.merge(
        existingLanguage,
        mergeValues
      );

      return this.languageRepo.save(updatedValue);
    } catch (err) {
      throw err;
    }
  }

  deleteLanguage(userId: number, id: number): Promise<DeleteResult> {
    try {
      const existingLanguage = this.languageRepo.findOne({
        where: { id: id, user: { id: userId } },
      });
      if (!existingLanguage) throw new NotFoundError("Language not found");

      return this.languageRepo.delete({ id });
    } catch (err) {
      throw err;
    }
  }
}

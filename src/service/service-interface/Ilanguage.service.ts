import { DeleteResult } from "typeorm";
import { LanguageEntity } from "../../entity/Language";

export interface ILanguageService {
  createLanguage(
    userId: number,
    language: any
  ): Promise<Partial<LanguageEntity>>;
  getAllLanguages(): Promise<LanguageEntity[]>;
  getLanguagesByUserId(userId: number): Promise<LanguageEntity[]>;
  getSingleLanguage(id: number): Promise<LanguageEntity>;
  updateLanguage(
    userId: number,
    id: number,
    language: any
  ): Promise<Partial<LanguageEntity>>;
  deleteLanguage(userId: number, id: number): Promise<DeleteResult>;
}

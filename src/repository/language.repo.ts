import { Repository } from "typeorm";
import { LanguageEntity } from "../entity/Language";
import { AppDataSource } from "../data-source";

export const LanguageRepository: Repository<LanguageEntity> =
  AppDataSource.getRepository(LanguageEntity);

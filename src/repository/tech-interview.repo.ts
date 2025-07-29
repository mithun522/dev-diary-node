import { Repository } from "typeorm";
import { TechInterview } from "../entity/TechInterview";
import { AppDataSource } from "../data-source";

export const TechInterviewRepo: Repository<TechInterview> =
  AppDataSource.getRepository(TechInterview);

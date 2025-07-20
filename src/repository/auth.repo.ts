import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Auth } from "../entity/Auth";

export const AuthRepository: Repository<Auth> =
  AppDataSource.getRepository(Auth);

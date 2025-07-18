import { Repository } from "typeorm";
import { User } from "../entity/User";
import { AppDataSource } from "../data-source";

export const UserRepository: Repository<User> =
  AppDataSource.getRepository(User);

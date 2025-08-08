import { Repository } from "typeorm";
import { Dsa } from "../entity/Dsa";
import { AppDataSource } from "../data-source";

export const DsaRepository: Repository<Dsa> = AppDataSource.getRepository(Dsa);

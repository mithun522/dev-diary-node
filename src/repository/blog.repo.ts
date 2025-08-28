import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Blogs } from "../entity/Blog";

export const BlogRepository: Repository<Blogs> =
  AppDataSource.getRepository(Blogs);

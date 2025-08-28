import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Auth } from "./entity/Auth";
import { TechInterview } from "./entity/TechInterview";
import { Dsa } from "./entity/Dsa";
import { Blogs } from "./entity/Blog";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "devdiary",
  synchronize: true,
  logging: false,
  entities: [User, Auth, TechInterview, Dsa, Blogs],
  migrations: [],
  subscribers: [],
});

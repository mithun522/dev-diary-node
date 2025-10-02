import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User/User";
import { Auth } from "./entity/Auth";
import { TechInterview } from "./entity/TechInterview";
import { Dsa } from "./entity/Dsa";
import { Blogs } from "./entity/Blog";
import { ProfessionalDetails } from "./entity/User/ProfessionalDetails";
import { SocialLinks } from "./entity/User/SocialLinks";
import { LanguageEntity } from "./entity/Language";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "devdiary",
  synchronize: true,
  logging: false,
  entities: [
    User,
    Auth,
    TechInterview,
    Dsa,
    Blogs,
    ProfessionalDetails,
    SocialLinks,
    LanguageEntity,
  ],
  migrations: [],
  subscribers: [],
});

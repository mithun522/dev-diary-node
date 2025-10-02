import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TechInterview } from "./TechInterview";
import { User } from "./User/User";

@Entity()
export class LanguageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "language" })
  language: string;

  @ManyToMany(() => TechInterview, (techInterview) => techInterview.language)
  techInterview: TechInterview[];

  @OneToMany(() => User, (user) => user.languages)
  user: User;
}

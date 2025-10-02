import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User/User";
import { Language } from "../enum/programming-language.enum";
import { Exclude } from "class-transformer";
import { LanguageEntity } from "./Language";

@Entity()
export class TechInterview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "question", nullable: false })
  question: string;

  @Column({ name: "answer", type: "longtext", nullable: false })
  answer: string;

  @Column({ name: "notes", type: "longtext", default: null })
  notes: string;

  @Column({ name: "language", nullable: false })
  language: Language;

  // NEW: Many-to-Many relation
  @ManyToMany(() => LanguageEntity, (language) => language.techInterview, {
    cascade: true,
  })
  @JoinTable({
    name: "tech_interview_languages", // join table name
    joinColumn: {
      name: "tech_interview_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "language_id",
      referencedColumnName: "id",
    },
  })
  languages: LanguageEntity[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  @Exclude()
  user: User;

  @Column({ name: "create_at" })
  createdAt: Date;

  @Column({ name: "update_at" })
  updatedAt: Date;
}

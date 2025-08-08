import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Language } from "../enum/programming-language.enum";
import { Exclude } from "class-transformer";

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

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  @Exclude()
  user: User;

  @Column({ name: "create_at" })
  createdAt: Date;

  @Column({ name: "update_at" })
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ProblemTopics } from "../enum/problem-topics.enum";
import { Language } from "../enum/programming-language.enum";
import { User } from "./User/User";
import { DifficultyLevels } from "../enum/difficulty-levels.enum";
import { ProblemStatus } from "../enum/problem-status";

@Entity()
export class Dsa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "problem" })
  problem: string;

  @Column({
    name: "topics",
    type: "text",
    transformer: {
      to: (value: ProblemTopics[]) => JSON.stringify(value),
      from: (value: string) => {
        try {
          return JSON.parse(value) as ProblemTopics[];
        } catch {
          return [];
        }
      },
    },
  })
  topics: ProblemTopics[];

  @Column({ name: "difficulty", default: null })
  difficulty: DifficultyLevels;

  @Column({ name: "link" })
  link: string;

  @Column({ name: "brute_force_solution", type: "longtext" })
  bruteForceSolution: string;

  @Column({ name: "better_solution", type: "longtext" })
  betterSolution: string;

  @Column({ name: "optimised_solution", type: "longtext" })
  optimisedSolution: string;

  @Column({ name: "language" })
  language: Language;

  @Column({ name: "notes", type: "longtext", default: null })
  notes: string;

  @Column({ name: "is_solved", default: false })
  isSolved: boolean;

  @Column({ name: "status", default: "UNSOLVED" })
  status: ProblemStatus;

  @ManyToOne(() => User)
  @Column({ name: "created_by" })
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

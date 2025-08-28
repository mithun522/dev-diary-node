import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { IsNotEmpty } from "class-validator";

@Entity()
export class Blogs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @IsNotEmpty()
  title: string;

  @Column({ type: "longtext", default: null })
  summary: string;

  @Column({ type: "longtext", nullable: false })
  @IsNotEmpty()
  content: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  image_url: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "author" })
  @IsNotEmpty()
  author: User;

  @Column({ default: "[]" })
  tags: string;

  @Column({ name: "read_time", default: 0 })
  readTime: number;

  @Column({ default: false })
  published: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

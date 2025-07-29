import { Entity, PrimaryGeneratedColumn, Column, Table } from "typeorm";
import { Roles } from "../enum/roles.enum";
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name" })
  lastName: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "password" })
  @Exclude()
  password: string;

  @Column({ name: "role" })
  role: Roles;

  @Column({ name: "is_ active", default: false })
  isActive: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at" })
  updatedAt: Date;

  @Column({ name: "avatar_url" })
  avatarUrl: string;
}

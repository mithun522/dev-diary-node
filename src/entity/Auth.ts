import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn()
  token: string;
}

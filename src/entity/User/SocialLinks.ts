import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class SocialLinks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "github" })
  github: string;

  @Column({ name: "linked_in" })
  linkedIn: string;

  @Column({ name: "personal_portfolio" })
  personalPortfolio: string;

  @OneToOne(() => User, (user) => user.socialLinks)
  user: User;
}

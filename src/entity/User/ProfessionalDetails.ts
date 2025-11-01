import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class ProfessionalDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  designation: string;

  @Column({ name: "current_role" })
  currentRole: string;

  @Column({ name: "company_name" })
  companyName: string;

  @Column({ name: "experience" })
  experience: number;

  @Column({ name: "location" })
  location: string;

  @Column({ name: "skills", type: "text" })
  skills: string[];

  @OneToOne(() => User, (user) => user.professionalDetails)
  user: User;
}

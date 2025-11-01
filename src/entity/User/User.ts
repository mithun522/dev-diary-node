import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Table,
  OneToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { Roles } from "../../enum/roles.enum";
import { Exclude } from "class-transformer";
import { ProfessionalDetails } from "./ProfessionalDetails";
import { SocialLinks } from "./SocialLinks";
import { Dsa } from "../Dsa";
import { LanguageEntity } from "../Language";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  firstName: string;

  @Column({ name: "last_name", nullable: true })
  lastName?: string;

  @Column({ name: "email" })
  email: string;

  @Column({ name: "password" })
  @Exclude()
  password: string;

  @Column({ name: "role", default: Roles.USER })
  role: Roles;

  @Column({ name: "bio", nullable: true })
  bio?: string;

  @Column({ name: "is_ active", default: false })
  isActive: boolean;

  @Column({ name: "created_at" })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt?: Date;

  @Column({ name: "avatar_url", nullable: true })
  avatarUrl?: string;

  @OneToOne(() => ProfessionalDetails, {
    cascade: true,
    eager: false,
    nullable: true,
  })
  @JoinColumn()
  professionalDetails?: ProfessionalDetails;

  @OneToOne(() => SocialLinks, { cascade: true, eager: false, nullable: true })
  @JoinColumn()
  socialLinks?: SocialLinks;

  @OneToMany(() => LanguageEntity, (language) => language.user)
  languages: LanguageEntity[];

  @OneToMany(() => Dsa, (dsa) => dsa.createdBy)
  dsa: Dsa[];
}

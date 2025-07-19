import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @Column({ name: "otp", nullable: true })
  otp: string;

  @Column({ name: "otp_expires_at", nullable: true })
  otpExpiresAt: Date;

  @Column({ name: "otp_verified", default: false })
  otpVerified: boolean;

  @Column({ name: "reset_token", nullable: true })
  resetToken: string;

  @Column({ name: "reset_token_expires_at", nullable: true })
  resetTokenExpiresAt: Date;
}

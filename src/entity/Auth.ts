import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./User/User";
import { OtpVerificationStatus } from "../enum/otp-verification";

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
  otpVerified: OtpVerificationStatus;

  @Column({ name: "reset_token", nullable: true })
  resetToken: string;

  @Column({ name: "reset_token_expires_at", nullable: true })
  resetTokenExpiresAt: Date;

  @Column({ name: "created_at", nullable: true })
  createdAt: Date;

  @Column({ name: "updated_at", nullable: true })
  updatedAt: Date;
}

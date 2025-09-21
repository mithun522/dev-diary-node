import { UserRepository } from "../repository/User.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../error/not-found.error";
import { ConflictError } from "../error/conflict.error";
import { User } from "../entity/User/User";
import { CreateUserDto } from "../dto/create-user.dto";
import {
  checkForAllRequiredFields,
  emailCheck,
  emailWithExistingUser,
} from "../utils/user-validation.utils";
import { Roles } from "../enum/roles.enum";
import { BadRequestError } from "../error/bad-request.error";
import nodemailer from "nodemailer";
import generateOTP from "../utils/generate-otp.utils";
import { AuthRepository } from "../repository/auth.repo";
import { configDotenv } from "dotenv";
import { OtpVerificationStatus } from "../enum/otp-verification";
import { generateMailOptions } from "../utils/mail";
import { generateLoginEmailHtml } from "../templates/welcome";
import { INCORRECT_PASSWORD, USER_EXISTS } from "../constants/error.constants";

configDotenv();

export class AuthService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await checkForAllRequiredFields<CreateUserDto>(createUserDto, [
      "firstName",
      "lastName",
      "email",
      "password",
    ]);
    await emailCheck(createUserDto.email);
    await emailWithExistingUser(createUserDto.email);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 15);
    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.role = Roles.USER;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.avatarUrl = "";
    const mailOptions = generateMailOptions({
      to: createUserDto.email,
      subject: "Welcome to Dev Diary",
      text: "Welcome to Dev Diary",
      html: generateLoginEmailHtml(
        createUserDto.firstName + " " + createUserDto.lastName,
        createUserDto.email
      ),
    });

    await this.transporter.sendMail(mailOptions);

    try {
      const savedUser = await UserRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result as User;
    } catch (error) {
      throw new Error("Failed to create user " + error);
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; message: string }> {
    const user = await UserRepository.findOneBy({ email: email });

    if (!user) {
      throw new NotFoundError(USER_EXISTS);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ConflictError(INCORRECT_PASSWORD);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return { token: token, message: "Login successful" };
  }

  async sendOtp(email: string): Promise<{ message: string }> {
    if (!email) throw new BadRequestError("Email is required");
    const user = await UserRepository.findOneBy({ email: email });

    if (!user) throw new NotFoundError("User with given email doesn't exits");

    const otp = await generateOTP(4);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Otp for Dev Diary",
      text: `Your OTP code to verify email is ${otp}. This Otp is valid for 10 mins.`,
    };

    const alreadyExist = await AuthRepository.findOneBy({
      user: { id: user.id },
    });

    if (alreadyExist) {
      await AuthRepository.update(alreadyExist.id, {
        otp: otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        otpVerified: OtpVerificationStatus.NOT_VERIFIED,
        updatedAt: new Date(),
      });
    } else {
      await AuthRepository.save({
        user: user,
        otp: otp,
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        otpVerified: OtpVerificationStatus.NOT_VERIFIED,
        updatedAt: new Date(),
      });
    }

    await this.transporter.sendMail(mailOptions);
    return { message: "OTP sent successfully" };
  }

  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    if (!email || !otp) throw new BadRequestError("Email and OTP is required");

    const user = await UserRepository.findOneBy({ email: email });

    if (!user) throw new NotFoundError("User with given email doesn't exits");

    const alreadyExist = await AuthRepository.findOneBy({
      user: { id: user.id },
    });

    if (alreadyExist.otpVerified === OtpVerificationStatus.VERIFIED)
      throw new ConflictError("This Otp has been already verified");

    if (!alreadyExist) throw new NotFoundError("User not found");

    if (alreadyExist.otp !== otp) throw new BadRequestError("Invalid OTP");

    if (alreadyExist.otpExpiresAt < new Date())
      throw new BadRequestError("OTP expired");

    await AuthRepository.update(alreadyExist.id, {
      otpVerified: OtpVerificationStatus.VERIFIED,
    });
    return { message: "OTP verified successfully" };
  }

  async resetPassword(
    email: string,
    password: string
  ): Promise<{ message: string }> {
    if (!email || !password)
      throw new BadRequestError("Email and Password is required");

    const user = await UserRepository.findOneBy({ email: email });

    if (!user) throw new NotFoundError("User with given email doesn't exits");

    const authDb = await AuthRepository.findOneBy({
      user: { id: user.id },
    });

    if (authDb.otpVerified === OtpVerificationStatus.NOT_VERIFIED)
      throw new BadRequestError("Please verify your OTP first");

    if (authDb.otpVerified === OtpVerificationStatus.USED)
      throw new ConflictError("This Otp has been already used");

    const hashedPassword = await bcrypt.hash(password, 15);
    await UserRepository.update(user.id, {
      password: hashedPassword,
      updatedAt: new Date(),
    });

    AuthRepository.update(authDb.id, {
      otpVerified: OtpVerificationStatus.USED,
      updatedAt: new Date(),
    });
    return { message: "Password reset successfully" };
  }
}

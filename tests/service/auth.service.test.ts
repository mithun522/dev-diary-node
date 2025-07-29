import { AuthService } from "../../src/service/auth.service";
import { UserRepository } from "../../src/repository/User.repo";
import { AuthRepository } from "../../src/repository/auth.repo";
import * as userValidation from "../../src/utils/user-validation.utils";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { Roles } from "../../src/enum/roles.enum";
import { OtpVerificationStatus } from "../../src/enum/otp-verification";
import { user, userDto } from "../constants/test.constants";
import { BadRequestError } from "../../src/error/bad-request.error";
import { User } from "../../src/entity/User";
import {
  EMAIL_ALREADY_EXISTS,
  INCORRECT_PASSWORD,
  USER_EXISTS,
} from "../../src/constants/error.constants";
import { NotFoundError } from "../../src/error/not-found.error";
import { ConflictError } from "../../src/error/conflict.error";

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("nodemailer");

const mockSendMail = jest.fn().mockResolvedValue(true);
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: mockSendMail,
});

describe("AuthService.createUser", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  test("should create a user and send welcome email", async () => {
    jest.spyOn(userValidation, "emailCheck").mockImplementation(() => true);
    jest.spyOn(userValidation, "emailWithExistingUser").mockResolvedValue(true);
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    jest.spyOn(UserRepository, "save").mockResolvedValue({ ...user });

    const service = new AuthService();
    const result = await service.createUser({ ...userDto });

    expect(result).toMatchObject({
      id: user.id,
      email: user.email,
      role: Roles.USER,
    });

    expect(mockSendMail).toHaveBeenCalled();
  });

  test("should fail if the email is invalid", async () => {
    const errorMessage = "Enter a proper email format";

    jest.spyOn(userValidation, "emailCheck").mockImplementation(() => {
      throw new BadRequestError(errorMessage);
    });
    const service = new AuthService();
    await expect(
      service.createUser({ ...userDto, email: "invalid" })
    ).rejects.toThrow(errorMessage);
    await expect(
      service.createUser({ ...userDto, email: "invalid-email" })
    ).rejects.toThrow(errorMessage);
  });

  test("email check should fail if the email already exists", async () => {
    jest.spyOn(userValidation, "emailCheck").mockImplementation(() => true);
    jest
      .spyOn(userValidation, "emailWithExistingUser")
      .mockImplementation(async () => {
        throw new BadRequestError(EMAIL_ALREADY_EXISTS);
      });

    expect(authService.createUser(userDto)).rejects.toThrow(
      new BadRequestError(EMAIL_ALREADY_EXISTS)
    );
  });

  test("should fail if any of the required fields are missing", async () => {
    const service = new AuthService();
    await expect(service.createUser({} as User)).rejects.toThrow(
      new BadRequestError("FirstName is required to create a Entity")
    );
  });
});

describe("AuthService.login", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });
  test("should login and return token", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("fake-token");

    const service = new AuthService();
    const result = await service.login("mithun@example.com", "secret");

    expect(result).toEqual({
      token: "fake-token",
      message: "Login successful",
    });
  });

  test("should fail if the user with the provided email doesn't exist", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(null);
    expect(authService.login("mithun@example.com", "secret")).rejects.toThrow(
      new NotFoundError(USER_EXISTS)
    );
  });

  test("should check for password validity", async () => {
    jest.spyOn(UserRepository, "findOneBy").mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    expect(authService.login("mithun@example.com", "secret")).rejects.toThrow(
      new ConflictError(INCORRECT_PASSWORD)
    );
  });
});

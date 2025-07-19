import { UserRepository } from "../repository/User.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NotFoundError } from "../error/not-found.error";
import { ConflictError } from "../error/conflict.error";

export class AuthService {
  constructor() {}

  async login(
    email: string,
    password: string
  ): Promise<{ token: string; message: string }> {
    const user = await UserRepository.findOneBy({ email: email });

    if (!user) {
      throw new NotFoundError("User with provided email doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ConflictError("Password is incorrect");
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
}

import { User } from "../entity/User";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { UserRepository } from "../repository/User.repo";
import * as bcrypt from "bcrypt";
import {
  emailCheck,
  emailWithExistingUser,
} from "../utils/user-validation.utils";
import { instanceToPlain } from "class-transformer";

export class UserService {
  constructor() {}

  async getAllUser(): Promise<User[]> {
    return await UserRepository.find();
  }

  async getSingleUser(id: number): Promise<Partial<User>> {
    if (!id) throw new BadRequestError("id is required");

    const user = await UserRepository.findOneBy({ id });

    if (!user) throw new NotFoundError("User not found");

    return instanceToPlain(user);
  }

  async updateUser(id: number, user: User): Promise<User> {
    if (!id) throw new BadRequestError("id is required");

    await emailCheck(user.email);

    const findUserById = await UserRepository.findOneBy({ id: id });

    if (!findUserById) throw new NotFoundError("User not found");

    if (findUserById.email !== user.email) {
      await emailWithExistingUser(user.email);
    }

    if (findUserById.password !== user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 15);
      user.password = hashedPassword;
    }

    const updatedUser = await UserRepository.update(id, user);

    if (!updatedUser) throw new NotFoundError("User not found");
    return user;
  }

  async deleteUser(id: number): Promise<string> {
    if (!id) throw new BadRequestError("id is required");

    const user = await UserRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundError("User not found");
    await UserRepository.delete(id);
    return "User deleted successfully";
  }
}

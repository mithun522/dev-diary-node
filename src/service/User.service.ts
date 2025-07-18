import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entity/User";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { UserRepository } from "../repository/User.repo";
import * as bcrypt from "bcrypt";
import {
  emailCheck,
  emailWithExistingUser,
} from "../utils/user-validation.utils";

export class UserService {
  constructor() {}

  async getAllUser(): Promise<User[]> {
    return await UserRepository.find();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    await emailCheck(createUserDto.email);
    await emailWithExistingUser(createUserDto.email);

    console.log(createUserDto);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 15);
    const newUser = new User();
    newUser.firstName = createUserDto.firstName;
    newUser.lastName = createUserDto.lastName;
    newUser.email = createUserDto.email;
    newUser.password = hashedPassword;
    newUser.createdAt = new Date();
    newUser.updatedAt = new Date();
    newUser.avatarUrl = "";

    try {
      const savedUser = await UserRepository.save(newUser);
      const { password, ...result } = savedUser;
      return result as User;
    } catch (error) {
      throw new Error("Failed to create user " + error.message);
    }
  }

  async getSingleUser(id: number): Promise<User> {
    if (!id) throw new BadRequestError("id is required");

    const user = await UserRepository.findOneBy({ id });

    if (!user) throw new NotFoundError("User not found");

    return user;
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
}

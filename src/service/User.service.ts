import { User } from "../entity/User/User";
import { BadRequestError } from "../error/bad-request.error";
import { NotFoundError } from "../error/not-found.error";
import { UserRepository } from "../repository/User.repo";
import { emailCheck } from "../utils/user-validation.utils";
import { instanceToPlain } from "class-transformer";

export class UserService {
  constructor() {}

  async getAllUser(): Promise<User[]> {
    return await UserRepository.find();
  }

  async getSingleUser(id: number): Promise<Partial<User>> {
    try {
      if (!id) throw new BadRequestError("id is required");

      const user = await UserRepository.findOne({
        where: { id },
        relations: ["socialLinks", "professionalDetails"],
      });

      if (!user) throw new NotFoundError("User not found");

      return instanceToPlain(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: number, user: User): Promise<User> {
    try {
      if (!id) throw new BadRequestError("id is required");

      emailCheck(user.email);

      const findUserById = await UserRepository.findOneBy({ id: id });

      if (!findUserById) throw new NotFoundError("User not found");

      UserRepository.merge(findUserById, user);
      return await UserRepository.save(findUserById);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number): Promise<string> {
    if (!id) throw new BadRequestError("id is required");

    const user = await UserRepository.findOneBy({ id: id });
    if (!user) throw new NotFoundError("User not found");
    await UserRepository.delete(id);
    return "User deleted successfully";
  }
}

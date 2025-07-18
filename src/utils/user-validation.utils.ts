import { BadRequestError } from "../error/bad-request.error";
import { UserRepository } from "../repository/User.repo";

export const emailCheck = (email: string) => {
  if (!email) throw new BadRequestError("Email is required");
  const emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";

  if (!email.match(emailRegex))
    throw new BadRequestError("Enter a proper email format");

  return true;
};

export const emailWithExistingUser = async (email: string) => {
  const existingUser = await UserRepository.findOneBy({ email: email });
  if (existingUser)
    throw new BadRequestError("User with this email already exists");
  return true;
};

import { EMAIL_ALREADY_EXISTS } from "../constants/error.constants";
import { User } from "../entity/User";
import { BadRequestError } from "../error/bad-request.error";
import { UserRepository } from "../repository/User.repo";

export const emailCheck = (email: string): boolean => {
  if (!email) throw new BadRequestError("Email is required");
  const emailRegex = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$";

  if (!email.match(emailRegex))
    throw new BadRequestError("Enter a proper email format");

  return true;
};

export const emailWithExistingUser = async (
  email: string
): Promise<boolean> => {
  const existingUser = await UserRepository.findOneBy({ email: email });
  if (existingUser) throw new BadRequestError(EMAIL_ALREADY_EXISTS);
  return true;
};

export const checkForAllRequiredFields = <T>(
  entity: Partial<T>,
  requiredFields: string[],
  entityName = "Entity"
): boolean => {
  for (const field of requiredFields) {
    if (!entity[field as keyof T]) {
      throw new BadRequestError(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required to create a ${entityName}`
      );
    }
  }
  return true;
};

export const checkUserExists = async (
  requestedField: any,
  requestedValue: any
): Promise<User> => {
  const existingUser = await UserRepository.findOneBy({
    [requestedField]: requestedValue,
  });
  if (!existingUser) throw new BadRequestError("User not found");
  return existingUser;
};

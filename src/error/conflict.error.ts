import { CustomError } from "../utils/custom-error.utils";
import { ForbiddenError } from "./forbidden.error";

export class ConflictError extends CustomError {
  StatusCode: number = 409;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serialize(): { message: string; statusCode: number } {
    return {
      message: this.message,
      statusCode: this.StatusCode,
    };
  }
}

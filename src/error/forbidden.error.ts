import { CustomError } from "../utils/custom-error.utils";

export class ForbiddenError extends CustomError {
  StatusCode: number = 403;

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

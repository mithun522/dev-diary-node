import { CustomError } from "../utils/custom-error.utils";

export class UnauthenticatedError extends CustomError {
  StatusCode: number = 401;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  serialize(): { message: string; statusCode: number } {
    return {
      message: this.message,
      statusCode: this.StatusCode,
    };
  }
}

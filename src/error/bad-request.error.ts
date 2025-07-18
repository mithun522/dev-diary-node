import { CustomError } from "../utils/custom-error.utils";

export class BadRequestError extends CustomError {
  StatusCode: number = 400;

  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize(): { message: string; statusCode: number } {
    return {
      message: this.message,
      statusCode: this.StatusCode,
    };
  }
}

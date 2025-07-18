import { CustomError } from "../utils/custom-error.utils";

export class NotFoundError extends CustomError {
  StatusCode: number = 404;
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serialize(): { message: string; statusCode: number } {
    return {
      message: this.message,
      statusCode: this.StatusCode,
    };
  }
}

import { BaseError } from "./base-error"

export class LexingError extends BaseError {
  message: string

  constructor(message: string) {
    super(message)
    this.message = message
  }
}

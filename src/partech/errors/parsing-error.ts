import { BaseError } from "./base-error"
import * as Span from "../span"

export class ParsingError extends BaseError {
  message: string
  span: Span.Span

  constructor(message: string, opts: { span: Span.Span }) {
    super(message)
    this.message = message
    this.span = opts.span
  }
}

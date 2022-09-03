import { ElaborationError, ParsingError } from "../errors"

export function reportable(
  error: unknown,
): error is ParsingError | ElaborationError {
  return error instanceof ParsingError || error instanceof ElaborationError
}

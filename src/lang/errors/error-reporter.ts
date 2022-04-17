import * as Errors from "../errors"

export class ErrorReporter {
  report(error: unknown, opts: { path?: string; text: string }): string {
    const { path, text } = opts

    if (error instanceof Errors.ElaborationError) {
      return error.report({ path, text })
    } else if (error instanceof Errors.ParsingError) {
      return error.report(text)
    } else {
      throw error
    }
  }
}

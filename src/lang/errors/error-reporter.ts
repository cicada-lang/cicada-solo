import pt from "@cicada-lang/partech"
import * as Errors from "../errors"

export class ErrorReporter {
  report(error: unknown, opts: { path?: string; text: string }): string {
    const { path, text } = opts

    if (error instanceof Errors.ExpTrace) {
      return error.report({ path, text })
    } else if (error instanceof Errors.ParsingError) {
      return [
        path
          ? `I found syntax error in file: ${path}`
          : `I found syntax error in code:`,
        ``,
        pt.report(error.span, text),
        error.concise_message,
      ].join("\n")
    } else {
      throw error
    }
  }
}

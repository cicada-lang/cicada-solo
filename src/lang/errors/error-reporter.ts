import * as Errors from "../errors"
import pt from "@cicada-lang/partech"

export class ErrorReporter {
  report(error: unknown, opts: { path?: string; text: string }): string {
    const { path, text } = opts

    if (error instanceof Errors.ExpTrace) {
      return error.report({ path, text })
    } else if (error instanceof pt.ParsingError) {
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

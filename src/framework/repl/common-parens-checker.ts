import * as pt from "@cicada-lang/partech"
import { ParensChecker } from "./parens-checker"

export class CommonParensChecker extends ParensChecker {
  depth(text: string): number {
    return pt.lexers.common.parens_depth(text)
  }

  check(text: string): CommonParensCheckResult {
    const result = pt.lexers.common.parens_check(text)
    if (result.kind === "excess") {
      return new CommonParensCheckError({ ...result, text })
    } else if (result.kind === "mismatch") {
      return new CommonParensCheckError({ ...result, text })
    } else {
      return result
    }
  }

  reportError(error: Error): void {
    if (error instanceof CommonParensCheckError) {
      const { kind, token, text } = error
      console.error()
      console.error(`parentheses ${kind}:`)
      console.error(pt.report(token.span, text))
    } else {
      console.error()
      console.error(`Unknown parentheses error: ${error}`)
    }
  }
}

type CommonParensCheckResult =
  | { kind: "balance" }
  | { kind: "lack" }
  | CommonParensCheckError

class CommonParensCheckError extends Error {
  kind: "excess" | "mismatch"
  token: pt.Token
  text: string

  constructor(opts: {
    kind: "excess" | "mismatch"
    token: pt.Token
    text: string
  }) {
    super()
    this.kind = opts.kind
    this.token = opts.token
    this.text = opts.text
  }
}

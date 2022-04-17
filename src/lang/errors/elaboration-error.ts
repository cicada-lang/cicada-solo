import pt from "@cicada-lang/partech"
import { Exp } from "../exp"

export class ElaborationError extends Error {
  message: string
  previous: Array<Exp> = []

  constructor(message: string) {
    super()
    this.message = message
  }

  trail(x: Exp): this {
    this.previous.push(x)
    return this
  }

  report(text: string): string {
    let s = ""

    s += this.message
    s += "\n"

    if (this.previous.length > 0) {
      s += "\n"

      for (const exp of this.previous) {
        if (exp.meta?.span) {
          s += pt.report(exp.meta?.span, text)
          break
        }
      }
    }

    return s
  }
}

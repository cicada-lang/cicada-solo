import pt from "@cicada-lang/partech"
import { Span } from "../span"
import { Exp } from "../exp"

export class ElaborationError extends Error {
  message: string
  private previous: Array<Exp> = []

  constructor(message: string) {
    super()
    this.message = message
  }

  pushExp(x: Exp): void {
    this.previous.push(x)
  }

  report(text: string): string {
    let s = ""

    s += this.message
    s += "\n"

    if (this.firstSpan) {
      s += "\n"
      s += pt.report(this.firstSpan, text)
    }

    return s
  }

  private get firstSpan(): Span | undefined {
    for (const exp of this.previous) {
      if (exp.meta?.span) return exp.meta.span
    }
  }
}

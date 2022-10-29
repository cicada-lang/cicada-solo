import * as pt from "@cicada-lang/partech"
import { Exp } from "../exp"
import { Span } from "../span"

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
    if (this.firstSpan) {
      return [this.message, "", pt.report(this.firstSpan, text)].join("\n")
    } else {
      return this.message
    }
  }

  private get firstSpan(): Span | undefined {
    for (const exp of this.previous) {
      if (exp.meta?.span) return exp.meta.span
    }
  }
}

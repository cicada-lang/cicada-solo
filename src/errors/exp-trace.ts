import { Exp } from "../exp"
import pt from "@cicada-lang/partech"

export class ExpTrace extends Error {
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

  report(opts: { text?: string }): string {
    const { text } = opts

    if (text === undefined) {
      let s = ""
      s += this.message
      s += "\n"

      if (this.previous.length > 0) {
        s += "\n"
        s += "previous expressions:\n"
        for (const exp of this.previous) {
          s += `- ${exp.repr()}\n`
        }
      }

      return s
    } else {
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
}

import pt from "@cicada-lang/partech"
import * as ut from "../../ut"
import { Exp } from "../exp"

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

  report(opts: { path?: string; text: string }): string {
    const { path, text } = opts

    let s = ""

    s += this.message
    s += "\n"

    if (this.previous.length > 0) {
      s += "\n"

      for (const exp of this.previous) {
        if (exp.meta?.span) {
          if (path) {
            s += ut.colors.yellow(path + ":")
            s += "\n"
          }

          s += pt.report(exp.meta?.span, text)

          break
        }
      }
    }

    return s
  }
}

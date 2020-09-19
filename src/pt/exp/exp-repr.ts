import * as Exp from "../exp"
import * as ut from "../../ut"

export function repr(exp: Exp.Exp): string {
  switch (exp.kind) {
    case "Exp.v": {
      const { name } = exp
      return name
    }
    case "Exp.ap": {
      const { target, args } = exp
      const head = repr(target)
      const body = args.map(repr).join(" ")
        return head + "(" + body + ")"
    }
    case "Exp.lit": {
      const { value } = exp
      return JSON.stringify(value)
    }
  }
}

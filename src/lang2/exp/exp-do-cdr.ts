import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"

export function do_cdr(cons: Value.Value): Value.Value {
  switch (cons.kind) {
    case "Value.Cons": {
      return cons.cdr
    }
    case "Value.Reflection": {
      switch (cons.t.kind) {
        case "Value.Sigma": {
          return {
            kind: "Value.Reflection",
            t: Closure.apply(cons.t.closure, Exp.do_car(cons)),
            neutral: {
              kind: "Neutral.Cdr",
              cons: cons.neutral,
            },
          }
        }
        default: {
          throw new Error("TODO")
        }
      }
    }
    default: {
      throw new Error("TODO")
    }
  }
}

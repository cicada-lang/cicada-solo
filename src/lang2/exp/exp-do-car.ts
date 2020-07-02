import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_car(cons: Value.Value): Value.Value {
  switch (cons.kind) {
    case "Value.Cons": {
      return cons.car
    }
    case "Value.Reflection": {
      switch (cons.t.kind) {
        case "Value.Sigma": {
          return {
            kind: "Value.Reflection",
            t: cons.t.car_t,
            neutral: { kind: "Neutral.Car", cons: cons.neutral },
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

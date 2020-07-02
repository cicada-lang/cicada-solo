import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_car(target: Value.Value): Value.Value {
  switch (target.kind) {
    case "Value.Cons": {
      return target.car
    }
    case "Value.Reflection": {
      switch (target.t.kind) {
        case "Value.Sigma": {
          return {
            kind: "Value.Reflection",
            t: target.t.car_t,
            neutral: {
              kind: "Neutral.Car",
              target: target.neutral,
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

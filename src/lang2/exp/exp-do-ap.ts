import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Closure from "../closure"

export function do_ap(rator: Value.Value, rand: Value.Value): Value.Value {
  switch (rator.kind) {
    case "Value.Fn": {
      return Closure.apply(rator.closure, rand)
    }
    case "Value.Reflection": {
      switch (rator.t.kind) {
        case "Value.Pi": {
          return {
            kind: "Value.Reflection",
            t: Closure.apply(rator.t.closure, rand),
            neutral: {
              kind: "Neutral.Ap",
              rator: rator.neutral,
              rand: new Normal.Normal(rator.t.arg_t, rand),
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

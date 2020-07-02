import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Closure from "../closure"
import * as Trace from "../../trace"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  switch (target.kind) {
    case "Value.Fn": {
      return Closure.apply(target.closure, arg)
    }
    case "Value.Reflection": {
      switch (target.t.kind) {
        case "Value.Pi": {
          return {
            kind: "Value.Reflection",
            t: Closure.apply(target.t.closure, arg),
            neutral: {
              kind: "Neutral.Ap",
              target: target.neutral,
              arg: new Normal.Normal(target.t.arg_t, arg),
            },
          }
        }
        default: {
          throw new Trace.Trace(
            Exp.explain_elim_target_type_mismatch({
              elim: "ap",
              expecting: ["Value.Pi"],
              reality: target.t.kind,
            })
          )
        }
      }
    }
    default: {
      throw new Trace.Trace(
        Exp.explain_elim_target_mismatch({
          elim: "ap",
          expecting: ["Value.Fn", "Value.Reflection"],
          reality: target.kind,
        })
      )
    }
  }
}

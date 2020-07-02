import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Trace from "../../trace"

export function do_cdr(target: Value.Value): Value.Value {
  switch (target.kind) {
    case "Value.Cons": {
      return target.cdr
    }
    case "Value.Reflection": {
      switch (target.t.kind) {
        case "Value.Sigma": {
          return {
            kind: "Value.Reflection",
            t: Closure.apply(target.t.closure, Exp.do_car(target)),
            neutral: {
              kind: "Neutral.Cdr",
              target: target.neutral,
            },
          }
        }
        default: {
          throw new Trace.Trace(
            Exp.explain_elim_target_type_mismatch({
              elim: "cdr",
              expecting: ["Value.Sigma"],
              reality: target.t.kind,
            })
          )
        }
      }
    }
    default: {
      throw new Trace.Trace(
        Exp.explain_elim_target_mismatch({
          elim: "cdr",
          expecting: ["Value.Cons", "Value.Reflection"],
          reality: target.kind,
        })
      )
    }
  }
}

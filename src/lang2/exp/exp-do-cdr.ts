import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Trace from "../../trace"

export function do_cdr(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.cdr
  } else if (target.kind === "Value.reflection") {
    if (target.t.kind === "Value.sigma") {
      return {
        kind: "Value.reflection",
        t: Closure.apply(target.t.closure, Exp.do_car(target)),
        neutral: { kind: "Neutral.cdr", target: target.neutral },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "cdr",
          expecting: ["Value.sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "cdr",
        expecting: ["Value.cons", "Value.reflection"],
        reality: target.kind,
      })
    )
  }
}

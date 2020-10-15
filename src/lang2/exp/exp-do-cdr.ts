import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"

import * as Trace from "../../trace"

export function do_cdr(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.cdr
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.sigma") {
      return Value.not_yet(
        Value.Closure.apply(target.t.cdr_t_cl, Exp.do_car(target)),
        Neutral.cdr(target.neutral)
      )
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
        expecting: ["Value.cons", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}

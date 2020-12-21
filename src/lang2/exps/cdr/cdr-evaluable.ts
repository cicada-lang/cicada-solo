import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Trace from "../../../trace"
import { do_car } from "../car"

export const cdr_evaluable = (target: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_cdr(evaluate(env, target)),
  })

export function do_cdr(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.cdr
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.sigma") {
      return Value.not_yet(
        Value.Closure.apply(target.t.cdr_t_cl, do_car(target)),
        Neutral.cdr(target.neutral)
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "cdr",
          expecting: ["Value.sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "cdr",
        expecting: ["Value.cons", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}

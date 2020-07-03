import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_car(target: Value.Value): Value.Value {
  if (target.kind === "Value.Cons") {
    return target.car
  } else if (target.kind === "Value.Reflection") {
    if (target.t.kind === "Value.Sigma") {
      return {
        kind: "Value.Reflection",
        t: target.t.car_t,
        neutral: { kind: "Neutral.Car", target: target.neutral },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "car",
          expecting: ["Value.Sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "car",
        expecting: ["Value.Cons", "Value.Reflection"],
        reality: target.kind,
      })
    )
  }
}

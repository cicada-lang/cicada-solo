import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_car(target: Value.Value): Value.Value {
  if (target.kind === "Value.cons") {
    return target.car
  } else if (target.kind === "Value.reflection") {
    if (target.t.kind === "Value.sigma") {
      return Value.reflection(target.t.car_t, Neutral.car(target.neutral))
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "car",
          expecting: ["Value.sigma"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "car",
        expecting: ["Value.cons", "Value.reflection"],
        reality: target.kind,
      })
    )
  }
}

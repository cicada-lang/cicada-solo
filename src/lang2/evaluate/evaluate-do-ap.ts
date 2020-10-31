import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"
import * as Trace from "../../trace"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    return Value.Closure.apply(target.ret_cl, arg)
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Value.pi") {
      return Value.not_yet(
        Value.Closure.apply(target.t.ret_t_cl, arg),
        Neutral.ap(target.neutral, Normal.create(target.t.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Value.pi"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["Value.fn", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}

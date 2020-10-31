import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    const new_env = Env.update(Env.clone(target.env), target.name, arg)
    return Evaluate.evaluate(new_env, target.ret)
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Ty.arrow") {
      return Value.not_yet(
        target.t.ret_t,
        Neutral.ap(target.neutral, new Normal.Normal(target.t.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Evaluate.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Ty.arrow"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Evaluate.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["Value.fn", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}

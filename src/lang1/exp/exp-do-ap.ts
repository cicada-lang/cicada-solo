import * as Exp from "../exp"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    const new_env = Env.extend(Env.clone(target.env), target.name, arg)
    return Exp.evaluate(new_env, target.body)
  } else if (target.kind === "Value.reflection") {
    if (target.t.kind === "Ty.arrow") {
      return {
        kind: "Value.reflection",
        t: target.t.ret_t,
        neutral: {
          kind: "Neutral.ap",
          target: target.neutral,
          arg: new Normal.Normal(target.t.arg_t, arg),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Ty.arrow"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["Value.fn", "Value.reflection"],
        reality: target.kind,
      })
    )
  }
}

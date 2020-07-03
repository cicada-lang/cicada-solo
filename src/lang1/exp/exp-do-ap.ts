import * as Exp from "../exp"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.Fn") {
    const new_env = Env.extend(Env.clone(target.env), target.name, arg)
    return Exp.evaluate(new_env, target.body)
  } else if (target.kind === "Value.Reflection") {
    if (target.t.kind === "Ty.Arrow") {
      return {
        kind: "Value.Reflection",
        t: target.t.ret_t,
        neutral: {
          kind: "Neutral.Ap",
          target: target.neutral,
          arg: new Normal.Normal(target.t.arg_t, arg),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Ty.Arrow"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["Value.Fn", "Value.Reflection"],
        reality: target.kind,
      })
    )
  }
}

import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { Arrow } from "../../exps/arrow-ty"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as Value from "../../value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"

export const ap_evaluable = (target: Exp, arg: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_ap(evaluate(env, target), evaluate(env, arg)),
  })

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "Value.fn") {
    const new_env = Env.update(Env.clone(target.env), target.name, arg)
    return Evaluate.evaluate(new_env, target.ret)
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Arrow") {
      const arrow = target.t as Arrow
      return Value.not_yet(
        arrow.ret_t,
        Neutral.ap(target.neutral, new Normal.Normal(arrow.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["Arrow"],
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

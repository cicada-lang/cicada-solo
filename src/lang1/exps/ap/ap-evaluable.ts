import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { ArrowTy } from "../../exps/arrow-ty"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as Value from "../../value"
import { NotYetValue } from "../not-yet-value"
import { FnValue } from "../fn-value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"

export const ap_evaluable = (target: Exp, arg: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_ap(evaluate(env, target), evaluate(env, arg)),
  })

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (target.kind === "FnValue") {
    const new_env = Env.update(
      Env.clone((target as FnValue).env),
      (target as FnValue).name,
      arg
    )
    return Evaluate.evaluate(new_env, (target as FnValue).ret)
  } else if (target.kind === "NotYetValue") {
    if ((target as NotYetValue).t.kind === "ArrowTy") {
      const arrow = (target as NotYetValue).t as ArrowTy
      return NotYetValue(
        arrow.ret_t,
        Neutral.ap((target as NotYetValue).neutral, new Normal.Normal(arrow.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["ArrowTy"],
          reality: (target as NotYetValue).t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "ap",
        expecting: ["FnValue", "NotYetValue"],
        reality: target.kind,
      })
    )
  }
}

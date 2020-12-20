import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import { ArrowTy } from "../../exps/arrow-ty"
import * as Evaluate from "../../evaluate"
import * as Explain from "../../explain"
import * as Env from "../../env"
import * as Trace from "../../../trace"
import * as Value from "../../value"
import { NotYetValue, is_not_yet_value } from "../not-yet-value"
import { is_fn_value } from "../fn-value"
import { Normal } from "../../normal"
import { ApNeutral } from "../ap-neutral"

export const ap_evaluable = (target: Exp, arg: Exp) =>
  Evaluable({
    evaluability: ({ env }) => do_ap(evaluate(env, target), evaluate(env, arg)),
  })

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  if (is_fn_value(target)) {
    const new_env = Env.update(Env.clone(target.env), target.name, arg)
    return Evaluate.evaluate(new_env, target.ret)
  } else if (is_not_yet_value(target)) {
    if (target.t.kind === "ArrowTy") {
      const arrow = target.t as ArrowTy
      return NotYetValue(
        arrow.ret_t,
        ApNeutral(target.neutral, Normal(arrow.arg_t, arg))
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "ap",
          expecting: ["ArrowTy"],
          reality: target.t.kind,
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

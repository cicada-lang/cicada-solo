import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Explain from "../../explain"
import * as Ty from "../../ty"
import * as Trace from "../../../trace"
import * as Value from "../../value"
import * as Normal from "../../normal"
import * as Neutral from "../../neutral"
import { do_ap } from "../ap"
import { ArrowTy, NatTy } from "../../exps"
import { NotYetValue, is_not_yet_value } from "../not-yet-value"
import { is_add1_value } from "../add1-value"
import { is_zero_value } from "../zero-value"

export const rec_evaluable = (t: Ty.Ty, target: Exp, base: Exp, step: Exp) =>
  Evaluable({
    evaluability: ({ env }) =>
      do_rec(
        t,
        evaluate(env, target),
        evaluate(env, base),
        evaluate(env, step)
      ),
  })

export function do_rec(
  t: Ty.Ty,
  target: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  if (is_zero_value(target)) {
    return base
  } else if (is_add1_value(target)) {
    return do_ap(do_ap(step, target.prev), do_rec(t, target.prev, base, step))
  } else if (is_not_yet_value(target)) {
    if (target.t.kind === "NatTy") {
      const step_t = ArrowTy(NatTy, ArrowTy(t, t))
      return NotYetValue(
        t,
        Neutral.rec(
          t,
          target.neutral,
          new Normal.Normal(t, base),
          new Normal.Normal(step_t, step)
        )
      )
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "rec",
          expecting: ["NatTy"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "rec",
        expecting: ["ZeroValue", "Add1Value", "NotYetValue"],
        reality: target.kind,
      })
    )
  }
}

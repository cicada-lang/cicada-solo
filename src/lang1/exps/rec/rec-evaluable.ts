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
  if (target.kind === "Value.zero") {
    return base
  } else if (target.kind === "Value.add1") {
    return do_ap(do_ap(step, target.prev), do_rec(t, target.prev, base, step))
  } else if (target.kind === "Value.not_yet") {
    if (target.t.kind === "Ty.nat") {
      const step_t = Ty.arrow(Ty.nat, Ty.arrow(t, t))
      return Value.not_yet(
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
          expecting: ["Ty.nat"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "rec",
        expecting: ["Value.zero", "Value.add1", "Value.not_yet"],
        reality: target.kind,
      })
    )
  }
}

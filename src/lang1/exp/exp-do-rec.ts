import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Neutral from "../neutral"

export function do_rec(
  t: Ty.Ty,
  target: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  if (target.kind === "Value.zero") {
    return base
  } else if (target.kind === "Value.add1") {
    return Exp.do_ap(
      Exp.do_ap(step, target.prev),
      Exp.do_rec(t, target.prev, base, step)
    )
  } else if (target.kind === "Value.reflection") {
    if (target.t.kind === "Ty.nat") {
      const step_t = Ty.arrow(Ty.nat, Ty.arrow(t, t))
      return Value.reflection(
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
        Exp.explain_elim_target_type_mismatch({
          elim: "rec",
          expecting: ["Ty.nat"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "rec",
        expecting: ["Value.zero", "Value.add1", "Value.reflection"],
        reality: target.kind,
      })
    )
  }
}

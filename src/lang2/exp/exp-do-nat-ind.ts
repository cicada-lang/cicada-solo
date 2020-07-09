import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Closure from "../closure"
import * as Trace from "../../trace"

export function do_nat_ind(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  if (target.kind === "Value.Zero") {
    return base
  } else if (target.kind === "Value.Succ") {
    return Exp.do_ap(
      Exp.do_ap(step, target.prev),
      Exp.do_nat_ind(target.prev, motive, base, step)
    )
  } else if (target.kind === "Value.Reflection") {
    if (target.t.kind === "Value.Nat") {
      const motive_t: Value.Pi = {
        kind: "Value.Pi",
        arg_t: { kind: "Value.Nat" },
        closure: new Closure.Closure(Env.init(), "k", { kind: "Exp.Type" }),
      }
      const base_t = Exp.do_ap(motive, { kind: "Value.Zero" })
      const step_t = Exp.nat_ind_step_t(motive)
      return {
        kind: "Value.Reflection",
        t: Exp.do_ap(motive, target),
        neutral: {
          kind: "Neutral.NatInd",
          target: target.neutral,
          motive: new Normal.Normal(motive_t, motive),
          base: new Normal.Normal(base_t, base),
          step: new Normal.Normal(step_t, step),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "nat_ind",
          expecting: ["Value.Nat"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "nat_ind",
        expecting: ["Value.Zero", "Value.Succ", "Value.Reflection"],
        reality: target.kind,
      })
    )
  }
}

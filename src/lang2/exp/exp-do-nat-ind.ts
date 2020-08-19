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
  if (target.kind === "Value.zero") {
    return base
  } else if (target.kind === "Value.add1") {
    return Exp.do_ap(
      Exp.do_ap(step, target.prev),
      Exp.do_nat_ind(target.prev, motive, base, step)
    )
  } else if (target.kind === "Value.reflection") {
    if (target.t.kind === "Value.nat") {
      const motive_t: Value.pi = {
        kind: "Value.pi",
        arg_t: { kind: "Value.nat" },
        closure: new Closure.Closure(Env.init(), "k", { kind: "Exp.type" }),
      }
      const base_t = Exp.do_ap(motive, { kind: "Value.zero" })
      const step_t = Exp.nat_ind_step_t(motive)
      return {
        kind: "Value.reflection",
        t: Exp.do_ap(motive, target),
        neutral: {
          kind: "Neutral.nat_ind",
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
          expecting: ["Value.nat"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "nat_ind",
        expecting: ["Value.zero", "Value.add1", "Value.reflection"],
        reality: target.kind,
      })
    )
  }
}

import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Normal from "../normal"
import * as Closure from "../closure"
import * as Trace from "../../trace"

export function do_replace(
  target: Value.Value,
  motive: Value.Value,
  base: Value.Value
): Value.Value {
  if (target.kind === "Value.Same") {
    return base
  } else if (target.kind === "Value.Reflection") {
    if (target.t.kind === "Value.Equal") {
      const base_t = Exp.do_ap(motive, target.t.from)
      const closure = new Closure.Closure(Env.init(), "x", {
        kind: "Exp.Type",
      })
      const motive_t: Value.Pi = {
        kind: "Value.Pi",
        arg_t: target.t.t,
        closure,
      }
      return {
        kind: "Value.Reflection",
        t: Exp.do_ap(motive, target.t.to),
        neutral: {
          kind: "Neutral.Replace",
          target: target.neutral,
          motive: new Normal.Normal(motive_t, motive),
          base: new Normal.Normal(base_t, base),
        },
      }
    } else {
      throw new Trace.Trace(
        Exp.explain_elim_target_type_mismatch({
          elim: "replace",
          expecting: ["Value.Equal"],
          reality: target.t.kind,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Exp.explain_elim_target_mismatch({
        elim: "replace",
        expecting: ["Value.Same", "Value.Reflection"],
        reality: target.kind,
      })
    )
  }
}

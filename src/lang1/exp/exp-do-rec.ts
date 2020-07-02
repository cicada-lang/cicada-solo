import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"

export function do_rec(
  t: Ty.Ty,
  target: Value.Value,
  base: Value.Value,
  step: Value.Value
): Value.Value {
  switch (target.kind) {
    case "Value.Zero": {
      return base
    }
    case "Value.Succ": {
      return Exp.do_ap(
        Exp.do_ap(step, target.prev),
        Exp.do_rec(t, target.prev, base, step)
      )
    }
    case "Value.Reflection": {
      switch (target.t.kind) {
        case "Ty.Nat": {
          const step_t: Ty.Arrow = {
            kind: "Ty.Arrow",
            arg_t: { kind: "Ty.Nat" },
            ret_t: { kind: "Ty.Arrow", arg_t: t, ret_t: t },
          }
          return {
            kind: "Value.Reflection",
            t: t,
            neutral: {
              kind: "Neutral.Rec",
              ret_t: t,
              target: target.neutral,
              base: new Normal.Normal(t, base),
              step: new Normal.Normal(step_t, step),
            },
          }
        }
        default: {
          throw new Trace.Trace(
            Exp.explain_elim_target_type_mismatch({
              elim: "rec",
              expecting: ["Ty.Nat"],
              reality: target.t.kind
            })
          )
        }
      }
    }
    default: {
      throw new Trace.Trace(
        Exp.explain_elim_target_mismatch({
          elim: "rec",
          expecting: ["Value.Zero", "Value.Succ", "Value.Reflection"],
          reality: target.kind,
        })
      )
    }
  }
}

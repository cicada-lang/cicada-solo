import * as Exp from "../exp"
import * as Ty from "../ty"
import * as Env from "../env"
import * as Value from "../value"
import * as Normal from "../normal"
import * as ut from "../../ut"

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
      switch (target.neutral.t.kind) {
        case "Ty.Nat": {
          const step_t: Ty.Arrow = {
            kind: "Ty.Arrow",
            arg_t: { kind: "Ty.Nat" },
            ret_t: { kind: "Ty.Arrow", arg_t: t, ret_t: t },
          }
          return {
            kind: "Value.Reflection",
            neutral: {
              kind: "Neutral.Rec",
              t: t,
              ret_t: t,
              target: target.neutral,
              base: new Normal.Normal(t, base),
              step: new Normal.Normal(step_t, step),
            },
          }
        }
        default: {
          throw new Exp.Trace.Trace(
            ut.aline(`
              |This is a internal error.
              |During do_rec, I found the target.kind is Value.Reflection,
              |then I expect the target.t.kind to be Ty.Nat,
              |but it is ${target.neutral.t.kind}.
              |`)
          )
        }
      }
    }
    default: {
      throw new Exp.Trace.Trace(
        ut.aline(`
          |This is a internal error.
          |During do_rec, I expect the target.kind to be
          |  Value.Zero or Value.Succ or Value.Reflection,
          |but the target.kind is ${target.kind}.
          |`)
      )
    }
  }
}

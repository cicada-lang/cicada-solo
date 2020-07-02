import * as Exp from "../exp"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"
import * as ut from "../../ut"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  switch (target.kind) {
    case "Value.Fn": {
      const new_env = Env.extend(Env.clone(target.env), target.name, arg)
      return Exp.evaluate(new_env, target.body)
    }
    case "Value.Reflection": {
      switch (target.t.kind) {
        case "Ty.Arrow": {
          return {
            kind: "Value.Reflection",
            t: target.t.ret_t,
            neutral: {
              kind: "Neutral.Ap",
              target: target.neutral,
              arg: new Normal.Normal(target.t.arg_t, arg),
            },
          }
        }
        default: {
          throw new Trace.Trace(
            ut.aline(`
              |This is a internal error.
              |During do_ap, I found the target.kind is Value.Reflection,
              |then I expect the target.t.kind to be Ty.Arrow,
              |but it is ${target.t.kind}.
              |`)
          )
        }
      }
    }
    default: {
      throw new Trace.Trace(
        Exp.explain_elim_target_mismatch({
          elim: "ap",
          expecting: ["Value.Fn", "Value.Reflection"],
          reality: target.kind,
        })
      )
    }
  }
}

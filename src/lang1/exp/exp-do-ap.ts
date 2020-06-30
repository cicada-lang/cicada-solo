import * as Exp from "../exp"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as Value from "../value"
import * as Normal from "../normal"
import * as ut from "../../ut"

export function do_ap(rator: Value.Value, rand: Value.Value): Value.Value {
  switch (rator.kind) {
    case "Value.Fn": {
      const new_env = Env.extend(Env.clone(rator.env), rator.name, rand)
      return Exp.evaluate(new_env, rator.body)
    }
    case "Value.Reflection": {
      switch (rator.t.kind) {
        case "Ty.Arrow": {
          return {
            kind: "Value.Reflection",
            t: rator.t.ret_t,
            neutral: {
              kind: "Neutral.Ap",
              rator: rator.neutral,
              rand: new Normal.Normal(rator.t.arg_t, rand),
            },
          }
        }
        default: {
          throw new Trace.Trace(
            ut.aline(`
              |This is a internal error.
              |During do_ap, I found the rator.kind is Value.Reflection,
              |then I expect the rator.t.kind to be Ty.Arrow,
              |but it is ${rator.t.kind}.
              |`)
          )
        }
      }
    }
    default: {
      throw new Trace.Trace(
        ut.aline(`
          |This is a internal error.
          |During do_ap, I expect the rator.kind to be Value.Fn or Value.Reflection,
          |but the rator.kind is ${rator.kind}.
          |`)
      )
    }
  }
}

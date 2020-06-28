import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Normal from "../normal"
import * as ut from "../../ut"

export function do_ap(
  ap: Exp.Ap,
  rator: Value.Value,
  rand: Value.Value
): Value.Value {
  switch (rator.kind) {
    case "Value.Fn": {
      const new_env = Env.extend(Env.clone(rator.env), rator.name, rand)
      return Exp.evaluate(new_env, rator.body)
    }
    case "Value.Neutral": {
      const { t, neutral } = rator
      switch (t.kind) {
        case "Ty.Arrow": {
          return {
            kind: "Value.Neutral",
            t: t.ret,
            neutral: {
              kind: "Neutral.Ap",
              rator: neutral,
              rand: new Normal.Normal({
                t: t.arg,
                value: rand,
              }),
            },
          }
        }
        default: {
          throw new Exp.Trace.Trace(
            ap,
            ut.aline(`
              |This is a internal error.
              |During do_ap, I found the rator.kind is Value.Neutral,
              |then I expect the rator.t.kind to be Ty.Arrow,
              |but it is ${rator.t.kind}.
              |`)
          )
        }
      }
    }
    default: {
      throw new Exp.Trace.Trace(
        ap,
        ut.aline(`
          |This is a internal error.
          |During do_ap, I expect the rator.kind to be Value.Fn or Value.Neutral,
          |but the rator.kind is ${rator.kind}.
          |`)
      )
    }
  }
}

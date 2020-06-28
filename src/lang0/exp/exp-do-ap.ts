import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"

export function do_ap(rator: Value.Value, rand: Value.Value): Value.Value {
  switch (rator.kind) {
    case "Value.Fn": {
      const new_env = Env.extend(Env.clone(rator.env), rator.name, rand)
      return Exp.evaluate(new_env, rator.body)
    }
    case "Value.Reflection": {
      return {
        kind: "Value.Reflection",
        neutral: {
          kind: "Neutral.Ap",
          rator: rator.neutral,
          rand: rand,
        },
      }
    }
  }
}

import * as Exp from "../exp"
import * as Env from "../env"
import * as Value from "../value"
import * as Neutral from "../neutral"

export function do_ap(target: Value.Value, arg: Value.Value): Value.Value {
  switch (target.kind) {
    case "Value.fn": {
      const new_env = Env.update(Env.clone(target.env), target.name, arg)
      return Exp.evaluate(new_env, target.ret)
    }
    case "Value.reflection": {
      return Value.reflection(Neutral.ap(target.neutral, arg))
    }
  }
}

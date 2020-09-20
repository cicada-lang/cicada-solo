import * as Mod from "../mod"
import * as Env from "../env"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"

export function evaluate(
  mod: Mod.Mod,
  env: Env.Env,
  exp: Exp.Exp
): Array<Value.Value> {
  switch (exp.kind) {
    case "Exp.v": {
      throw new Error()
    }
    case "Exp.fn": {
      const { name, ret } = exp
      const ret_cl = { name, exp: ret, env, mod }
      return new Array(Value.fn(ret_cl))
    }
    case "Exp.ap": {
      throw new Error()
    }
    case "Exp.str": {
      const { value } = exp
      return new Array(Value.str(value))
    }
    case "Exp.gr": {
      throw new Error()
    }
  }
}

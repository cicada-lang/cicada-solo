import * as Closure from "../closure"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Env from "../env"
import * as Mod from "../mod"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  return Exp.evaluate(closure.mod, Env.extend(closure.env, closure.name, value), closure.ret)
}

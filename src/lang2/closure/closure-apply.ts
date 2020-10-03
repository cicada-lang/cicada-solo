import * as Closure from "../closure"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Env from "../env"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  const new_env = Env.update(Env.clone(closure.env), closure.name, value)
  return Exp.evaluate(new_env, closure.ret)
}

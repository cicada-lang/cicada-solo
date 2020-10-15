import * as Closure from "../closure"
import * as Value from "../../value"
import * as Exp from "../../exp"
import * as Env from "../../env"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  return Exp.evaluate(Env.extend(closure.env, closure.name, value), closure.ret)
}

import * as Closure from "../closure"
import * as Value from "../value"
import * as Exp from "../exp"
import { Env } from "../env"
import * as Evaluate from "../evaluate"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  return Evaluate.evaluate(closure.env.extend(closure.name, value), closure.ret)
}

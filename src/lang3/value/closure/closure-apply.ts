import * as Closure from "../closure"
import * as Value from "../../value"
import * as Pattern from "../../pattern"
import * as Exp from "../../exp"
import * as Env from "../../env"
import * as Mod from "../../mod"

export function apply(
  closure: Closure.Closure,
  value: Value.Value
): Value.Value {
  return Exp.evaluate(
    closure.mod,
    Pattern.match(closure.env, closure.pattern, value),
    closure.ret
  )
}

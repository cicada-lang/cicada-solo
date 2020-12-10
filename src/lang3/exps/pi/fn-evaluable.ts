import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Pattern from "../../pattern"

export function fn_evaluable(pattern: Pattern.Pattern, ret: Exp): Evaluable {
  return Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.fn(Value.Closure.create(mod, env, pattern, ret)),
  })
}

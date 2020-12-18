import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Pattern from "../../pattern"

export const pi_evaluable = (name: string, arg_t: Exp, ret_t: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) =>
      Value.pi(
        evaluate(arg_t, { mod, env, mode }),
        Value.Closure.create(mod, env, Pattern.v(name), ret_t)
      ),
  })

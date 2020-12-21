import { Exp } from "../../exp"
import * as Value from "../../value"
import { evaluate } from "../../evaluate"
import { Evaluable } from "../../evaluable"

export const pi_evaluable = (name: string, arg_t: Exp, ret_t: Exp) =>
  Evaluable({
    evaluability: ({ env }) =>
      Value.pi(evaluate(env, arg_t), Value.Closure.create(env, name, ret_t)),
  })

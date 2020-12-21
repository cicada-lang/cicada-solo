import { Exp } from "../../exp"
import * as Value from "../../value"
import { Evaluable } from "../../evaluable"

export const fn_evaluable = (name: string, ret: Exp) =>
  Evaluable({
    evaluability: ({ env }) => Value.fn(Value.Closure.create(env, name, ret)),
  })

import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { FnValue } from "../../exps/fn-value"

export const fn_evaluable = (name: string, ret: Exp) =>
  Evaluable({
    evaluability: ({ env }) => FnValue(name, ret, env),
  })

import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Value from "../../value"

export const fn_evaluable = (name: string, ret: Exp) =>
  Evaluable({
    evaluability: ({ env }) => Value.fn(name, ret, env),
  })

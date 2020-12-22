import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Fn = Evaluable & {
  kind: "Exp.fn"
  name: string
  ret: Exp
}

export function Fn(name: string, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    name,
    ret,
    ...Evaluable({
      evaluability: ({ env }) => Value.fn(name, ret, env),
    }),
  }
}

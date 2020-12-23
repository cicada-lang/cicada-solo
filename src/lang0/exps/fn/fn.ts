import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import * as Value from "../../value"
import { FnValue } from "../fn-value"

export type Fn = Exp & {
  kind: "Fn"
  name: string
  ret: Exp
}

export function Fn(name: string, ret: Exp): Fn {
  return {
    kind: "Fn",
    name,
    ret,
    ...Evaluable({
      evaluability: ({ env }) => FnValue(name, ret, env),
    }),
    repr: () => `(${name}) => ${ret.repr()}`,
  }
}

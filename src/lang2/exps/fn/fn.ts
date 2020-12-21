import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { fn_evaluable } from "./fn-evaluable"
import { Repr } from "../../repr"

export type Fn = Evaluable &
  Repr & {
    kind: "Exp.fn"
    name: string
    ret: Exp
  }

export function Fn(name: string, ret: Exp): Fn {
  return {
    kind: "Exp.fn",
    name,
    ret,
    repr: () => `(${name}) => ${ret.repr()}`,
    ...fn_evaluable(name, ret),
  }
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { fn_evaluable } from "./fn-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"

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
    repr: () => `(${name}) => ${repr(ret)}`,
    ...fn_evaluable(name, ret),
  }
}

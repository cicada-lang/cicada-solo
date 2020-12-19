import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { fn_evaluable } from "./fn-evaluable"

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
    ...fn_evaluable(name, ret),
  }
}

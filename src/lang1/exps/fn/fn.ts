import { Exp } from "../../exp"
import { fn_evaluable } from "./fn-evaluable"
import { fn_checkable } from "./fn-checkable"

export type Fn = Exp & {
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
    ...fn_checkable(name, ret),
    repr: () => `(${name}) => ${ret.repr()}`,
  }
}

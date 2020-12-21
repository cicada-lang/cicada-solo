import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { ap_evaluable } from "./ap-evaluable"

export type Ap = Evaluable & {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
    ...ap_evaluable(target, arg),
  }
}

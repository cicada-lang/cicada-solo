// import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"

export type Ap = {
  kind: "Exp.ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Exp.ap",
    target,
    arg,
  }
}

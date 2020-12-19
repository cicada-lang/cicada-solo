import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { ap_evaluable } from "./ap-evaluable"
import { Repr } from "../../repr"

export type Ap = Evaluable &
  Repr & {
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
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}

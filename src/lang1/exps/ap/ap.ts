import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { ap_evaluable } from "./ap-evaluable"
import { ap_inferable } from "./ap-inferable"
import { Repr } from "../../repr"

export type Ap = Evaluable &
  Inferable &
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
    ...ap_inferable(target, arg),
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}

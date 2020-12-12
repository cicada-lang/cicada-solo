import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { ap_evaluable } from "./ap-evaluable"
import { ap_inferable } from "./ap-inferable"

export type Ap = Evaluable &
  Inferable &
  Checkable &
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

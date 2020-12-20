import { Exp } from "../../exp"
import { ap_evaluable } from "./ap-evaluable"
import { ap_inferable } from "./ap-inferable"

export type Ap = Exp & {
  kind: "Ap"
  target: Exp
  arg: Exp
}

export function Ap(target: Exp, arg: Exp): Ap {
  return {
    kind: "Ap",
    target,
    arg,
    ...ap_evaluable(target, arg),
    ...ap_inferable(target, arg),
    repr: () => `${target.repr()}(${arg.repr()})`,
  }
}

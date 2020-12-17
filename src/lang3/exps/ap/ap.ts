import { Exp } from "../../exp"
import { ap_evaluable } from "./ap-evaluable"
import { ap_inferable } from "./ap-inferable"

export type Ap = Exp & {
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
    alpha_repr: (opts) => `${target.alpha_repr(opts)}(${arg.alpha_repr(opts)})`,
  }
}

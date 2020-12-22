import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { ap_evaluable } from "./ap-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Ap = Evaluable &
  Repr &
  AlphaRepr & {
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
    alpha_repr: (opts) => `${target.alpha_repr(opts)}(${arg.alpha_repr(opts)})`,
  }
}

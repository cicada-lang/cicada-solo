import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cdr_evaluable } from "./cdr-evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Cdr = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.cdr"
    target: Exp
  }

export function Cdr(target: Exp): Cdr {
  return {
    kind: "Exp.cdr",
    target,
    ...cdr_evaluable(target),
    repr: () => `cdr(${target.repr()})`,
    alpha_repr: (opts) => `cdr(${target.alpha_repr(opts)})`,
  }
}

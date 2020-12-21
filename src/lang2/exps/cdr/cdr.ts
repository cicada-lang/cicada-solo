import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cdr_evaluable } from "./cdr-evaluable"
import { Repr } from "../../repr"

export type Cdr = Evaluable &
  Repr & {
    kind: "Exp.cdr"
    target: Exp
  }

export function Cdr(target: Exp): Cdr {
  return {
    kind: "Exp.cdr",
    target,
    repr: () => `cdr(${target.repr()})`,
    ...cdr_evaluable(target),
  }
}

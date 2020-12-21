import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { cdr_evaluable } from "./cdr-evaluable"

export type Cdr = Evaluable & {
  kind: "Exp.cdr"
  target: Exp
}

export function Cdr(target: Exp): Cdr {
  return {
    kind: "Exp.cdr",
    target,
    ...cdr_evaluable(target),
  }
}

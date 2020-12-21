import { Exp } from "../../exp"

export type Cdr = {
  kind: "Exp.cdr"
  target: Exp
}

export function Cdr(target: Exp): Cdr {
  return {
    kind: "Exp.cdr",
    target,
  }
}

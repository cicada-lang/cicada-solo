import { Exp } from "../../exp"
import * as Ty from "../../ty"

export type Rec = {
  kind: "Exp.rec"
  t: Ty.Ty
  target: Exp
  base: Exp
  step: Exp
}

export function Rec(t: Ty.Ty, target: Exp, base: Exp, step: Exp): Rec {
  return {
    kind: "Exp.rec",
    t,
    target,
    base,
    step,
  }
}

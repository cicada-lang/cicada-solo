import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Ty from "../../ty"
import { rec_evaluable } from "./rec-evaluable"

export type Rec = Evaluable & {
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
    ...rec_evaluable(t, target, base, step),
  }
}

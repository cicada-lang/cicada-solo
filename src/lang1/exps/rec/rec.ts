import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Ty from "../../ty"
import { rec_evaluable } from "./rec-evaluable"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Rec = Evaluable &
  Repr & {
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
    repr: () =>
      `rec[${Ty.repr(t)}](${repr(target)}, ${repr(base)}, ${repr(step)})`,
  }
}

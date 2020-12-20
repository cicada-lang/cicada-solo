import { Exp } from "../../exp"
import { Ty } from "../../ty"
import { rec_evaluable } from "./rec-evaluable"
import { rec_inferable } from "./rec-inferable"

export type Rec = Exp & {
  kind: "Rec"
  t: Ty
  target: Exp
  base: Exp
  step: Exp
}

export function Rec(t: Ty, target: Exp, base: Exp, step: Exp): Rec {
  return {
    kind: "Rec",
    t,
    target,
    base,
    step,
    ...rec_evaluable(t, target, base, step),
    ...rec_inferable(t, target, base, step),
    repr: () =>
      `rec[${t.repr()}](${target.repr()}, ${base.repr()}, ${step.repr()})`,
  }
}

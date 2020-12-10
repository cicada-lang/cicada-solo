import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { absurd_ind_evaluable } from "./absurd-ind-evaluable"

export type AbsurdInd = Evaluable &
  Repr & {
    kind: "Exp.absurd_ind"
    target: Exp
    motive: Exp
  }

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "Exp.absurd_ind",
    target,
    motive,
    ...absurd_ind_evaluable(target, motive),
    repr: () => `Absurd.ind(${target.repr()}, ${motive.repr()})`,
  }
}

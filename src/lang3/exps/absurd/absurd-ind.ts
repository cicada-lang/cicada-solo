import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { absurd_ind_evaluable } from "./absurd-ind-evaluable"
import { absurd_ind_inferable } from "./absurd-ind-inferable"

export type AbsurdInd = Evaluable &
  Inferable &
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
    ...absurd_ind_inferable(target, motive),
    repr: () => `Absurd.ind(${target.repr()}, ${motive.repr()})`,
  }
}

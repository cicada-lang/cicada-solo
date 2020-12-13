import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import { absurd_ind_evaluable } from "./absurd-ind-evaluable"
import { absurd_ind_inferable } from "./absurd-ind-inferable"

export type AbsurdInd = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
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
    alpha_repr: (opts) =>
      `Absurd.ind(${alpha_repr(target, opts)}, ${alpha_repr(motive, opts)})`,
  }
}

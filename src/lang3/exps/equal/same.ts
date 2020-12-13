import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable, non_inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { same_evaluable } from "./same-evaluable"
import { same_checkable } from "./same-checkable"

export type Same = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.same"
  }

export const Same: Same = {
  kind: "Exp.same",
  ...same_evaluable,
  ...same_checkable,
  ...non_inferable,
  repr: () => "same",
  alpha_repr: (opts) => "same",
}

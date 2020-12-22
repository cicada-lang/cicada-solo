import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { same_checkable } from "./same-checkable"

export type Same = Exp & {
    kind: "Exp.same"
  }

export const Same: Same = {
  kind: "Exp.same",
  evaluability: (_) => Value.same,
  ...same_checkable,
  repr: () => "same",
  alpha_repr: () => "same",
}

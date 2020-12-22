import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Same = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.same"
  }

export const Same: Same = {
  kind: "Exp.same",
  evaluability: (_) => Value.same,
  repr: () => "same",
  alpha_repr: () => "same",
}

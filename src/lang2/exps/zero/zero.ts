import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Zero = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.zero"
  }

export const Zero: Zero = {
  kind: "Exp.zero",
  evaluability: (_) => Value.zero,
  repr: () => "0",
  alpha_repr: (_) => "0",
}

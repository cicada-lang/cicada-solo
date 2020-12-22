import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import * as Value from "../../value"
import { AlphaRepr } from "../../alpha-repr"

export type Absurd = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  evaluability: (_) => Value.absurd,
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}

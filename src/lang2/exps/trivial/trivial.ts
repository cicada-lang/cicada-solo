import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Trivial = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.trivial"
  }

export const Trivial: Trivial = {
  kind: "Exp.trivial",
  evaluability: ({ env }) => Value.trivial,
  repr: () => "Trivial",
  alpha_repr: () => "Trivial",
}

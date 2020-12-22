import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Nat = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.nat"
  }

export const Nat: Nat = {
  kind: "Exp.nat",
  evaluability: (_) => Value.nat,
  repr: () => "Nat",
  alpha_repr: () => "Nat",
}

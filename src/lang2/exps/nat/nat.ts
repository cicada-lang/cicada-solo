import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Nat = Evaluable &
  Repr & {
    kind: "Exp.nat"
  }

export const Nat: Nat = {
  kind: "Exp.nat",
  repr: () => "Nat",
  evaluability: (_) => Value.nat,
}

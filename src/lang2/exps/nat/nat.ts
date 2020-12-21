import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Nat = Evaluable & {
  kind: "Exp.nat"
}

export const Nat: Nat = {
  kind: "Exp.nat",
  evaluability: (_) => Value.nat,
}

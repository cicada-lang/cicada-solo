import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Nat = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.nat"
  }

export const Nat: Nat = {
  kind: "Exp.nat",
  evaluability: (_) => Value.nat,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Nat",
  alpha_repr: () => "Nat",
}

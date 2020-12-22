import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Nat = Exp & {
  kind: "Nat"
}

export const Nat: Nat = {
  kind: "Nat",
  evaluability: (_) => Value.nat,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Nat",
  alpha_repr: () => "Nat",
}

import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Nat = Exp & {
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

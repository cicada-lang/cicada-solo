import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Trivial = Exp & {
  kind: "Exp.trivial"
}

export const Trivial: Trivial = {
  kind: "Exp.trivial",
  evaluability: ({ env }) => Value.trivial,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Trivial",
  alpha_repr: () => "Trivial",
}

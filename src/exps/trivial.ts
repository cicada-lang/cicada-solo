import { Exp } from "../exp"
import { Inferable } from "../inferable"
import * as Value from "../value"

export type Trivial = Exp & {
  kind: "Trivial"
}

export const Trivial: Trivial = {
  kind: "Trivial",
  evaluability: ({ env }) => Value.trivial,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Trivial",
  alpha_repr: () => "Trivial",
}

import { Exp } from "../exp"
import { Inferable } from "../inferable"
import * as Value from "../value"

export type Absurd = Exp & {
  kind: "Absurd"
}

export const Absurd: Absurd = {
  kind: "Absurd",
  evaluability: (_) => Value.absurd,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}

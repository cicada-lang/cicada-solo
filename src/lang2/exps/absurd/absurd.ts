import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Absurd = Exp & {
  kind: "Exp.absurd"
}

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  evaluability: (_) => Value.absurd,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}

import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Sole = Exp & {
  kind: "Exp.sole"
}

export const Sole: Sole = {
  kind: "Exp.sole",
  evaluability: (_) => Value.sole,
  ...Inferable({
    inferability: ({ ctx }) => Value.trivial,
  }),
  repr: () => "sole",
  alpha_repr: (_) => "sole",
}

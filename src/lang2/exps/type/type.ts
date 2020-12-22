import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Type = Exp & {
  kind: "Exp.type"
}

export const Type: Type = {
  kind: "Exp.type",
  evaluability: (_) => Value.type,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Type",
  alpha_repr: () => "Type",
}

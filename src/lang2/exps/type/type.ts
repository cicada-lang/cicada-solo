import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Type = Exp & {
  kind: "Type"
}

export const Type: Type = {
  kind: "Type",
  evaluability: (_) => Value.type,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Type",
  alpha_repr: () => "Type",
}

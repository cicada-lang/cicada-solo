import { Exp } from "../../exp"
import { Inferable } from "../../inferable"
import * as Value from "../../value"

export type Str = Exp & {
  kind: "Str"
}

export const Str: Str = {
  kind: "Str",
  evaluability: (_) => Value.str,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "String",
  alpha_repr: () => "String",
}

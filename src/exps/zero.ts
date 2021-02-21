import { Exp } from "../exp"
import { Inferable } from "../inferable"
import * as Value from "../value"

export type Zero = Exp & {
  kind: "Zero"
}

export const Zero: Zero = {
  kind: "Zero",
  evaluability: (_) => Value.zero,
  ...Inferable({
    inferability: ({ ctx }) => Value.nat,
  }),
  repr: () => "0",
  alpha_repr: (_) => "0",
}

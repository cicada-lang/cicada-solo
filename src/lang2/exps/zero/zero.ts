import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Zero = Exp & {
    kind: "Exp.zero"
  }

export const Zero: Zero = {
  kind: "Exp.zero",
  evaluability: (_) => Value.zero,
  ...Inferable({
    inferability: ({ ctx }) => Value.nat,
  }),
  repr: () => "0",
  alpha_repr: (_) => "0",
}

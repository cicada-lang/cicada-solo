import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Str = Exp & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  evaluability: (_) => Value.str,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "String",
  alpha_repr: () => "String",
}

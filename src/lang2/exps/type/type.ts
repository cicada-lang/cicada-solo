import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Type = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
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

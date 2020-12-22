export { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Sole = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
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

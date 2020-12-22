export { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Sole = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.sole"
  }

export const Sole: Sole = {
  kind: "Exp.sole",
  evaluability: (_) => Value.sole,
  repr: () => "sole",
  alpha_repr: (_) => "sole",
}

export { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Sole = Evaluable &
  Repr & {
    kind: "Exp.sole"
  }

export const Sole: Sole = {
  kind: "Exp.sole",
  repr: () => "sole",
  evaluability: (_) => Value.sole,
}

export { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Sole = Evaluable & {
  kind: "Exp.sole"
}

export const Sole: Sole = {
  kind: "Exp.sole",
  evaluability: (_) => Value.sole,
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Same = Evaluable & {
  kind: "Exp.same"
}

export const Same: Same = {
  kind: "Exp.same",
  evaluability: (_) => Value.same,
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Same = Evaluable & Repr & {
  kind: "Exp.same"
}

export const Same: Same = {
  kind: "Exp.same",
  repr: () => "same",
  evaluability: (_) => Value.same,
}

import { Exp } from "../../exp"
import * as Value from "../../value"
import { same_checkable } from "./same-checkable"

export type Same = Exp & {
  kind: "Same"
}

export const Same: Same = {
  kind: "Same",
  evaluability: (_) => Value.same,
  ...same_checkable,
  repr: () => "same",
  alpha_repr: () => "same",
}

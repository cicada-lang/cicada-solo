import { non_inferable } from "../../inferable"
import { Exp } from "../../exp"
import { same_evaluable } from "./same-evaluable"
import { same_checkable } from "./same-checkable"

export type Same = Exp & {
  kind: "Exp.same"
}

export const Same: Same = {
  kind: "Exp.same",
  ...same_evaluable,
  ...same_checkable,
  ...non_inferable,
  repr: () => "same",
  alpha_repr: (opts) => "same",
}

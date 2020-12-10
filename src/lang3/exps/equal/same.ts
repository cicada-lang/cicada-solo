import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { same_evaluable } from "./same-evaluable"
import { same_checkable } from "./same-checkable"

export type Same = Evaluable &
  Checkable &
  Repr & {
    kind: "Exp.same"
  }

export const Same: Same = {
  kind: "Exp.same",
  ...same_evaluable,
  ...same_checkable,
  repr: () => "same",
}

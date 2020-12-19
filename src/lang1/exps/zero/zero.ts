import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { zero_evaluable } from "./zero-evaluable"
import { zero_checkable } from "./zero-checkable"
import { Repr } from "../../repr"

export type Zero = Evaluable & Checkable &
  Repr & {
    kind: "Exp.zero"
  }

export const Zero: Zero = {
  kind: "Exp.zero",
  ...zero_evaluable,
  ...zero_checkable,
  repr: () => "0",
}

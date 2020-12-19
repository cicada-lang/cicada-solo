import { Exp } from "../../exp"
import { zero_evaluable } from "./zero-evaluable"
import { zero_checkable } from "./zero-checkable"

export type Zero = Exp & {
  kind: "Exp.zero"
}

export const Zero: Zero = {
  kind: "Exp.zero",
  ...zero_evaluable,
  ...zero_checkable,
  repr: () => "0",
}

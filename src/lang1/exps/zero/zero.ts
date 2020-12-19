import { Evaluable } from "../../evaluable"
import { zero_evaluable } from "./zero-evaluable"

export type Zero = Evaluable & {
  kind: "Exp.zero"
}

export const Zero: Zero = {
  kind: "Exp.zero",
  ...zero_evaluable,
}

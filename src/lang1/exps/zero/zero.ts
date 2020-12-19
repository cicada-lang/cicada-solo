import { Evaluable } from "../../evaluable"
import { zero_evaluable } from "./zero-evaluable"
import { Repr } from "../../repr"


export type Zero = Evaluable & Repr & {
  kind: "Exp.zero"
}

export const Zero: Zero = {
  kind: "Exp.zero",
  ...zero_evaluable,
  repr: () => "0",
}

import { Exp } from "../../exp"
import { zero_evaluable } from "./zero-evaluable"
import { zero_checkable } from "./zero-checkable"

export type Zero = Exp & {
  kind: "Zero"
}

export const Zero: Zero = {
  kind: "Zero",
  ...zero_evaluable,
  ...zero_checkable,
  repr: () => "0",
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Zero = Evaluable & {
  kind: "Exp.zero"
}

export const Zero: Zero = {
  kind: "Exp.zero",
  evaluability: (_) => Value.zero,
}

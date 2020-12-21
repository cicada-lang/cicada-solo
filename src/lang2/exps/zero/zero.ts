import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Zero = Evaluable &
  Repr & {
    kind: "Exp.zero"
  }

export const Zero: Zero = {
  kind: "Exp.zero",
  repr: () => "0",
  evaluability: (_) => Value.zero,
}

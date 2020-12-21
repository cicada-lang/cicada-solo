import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Str = Evaluable & {
  kind: "Exp.str"
}

export const Str: Str = {
  kind: "Exp.str",
  evaluability: (_) => Value.str,
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Type = Evaluable & {
  kind: "Exp.type"
}

export const Type: Type = {
  kind: "Exp.type",
  evaluability: (_) => Value.type,
}

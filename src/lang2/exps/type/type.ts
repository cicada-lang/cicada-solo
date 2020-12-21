import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Type = Evaluable &
  Repr & {
    kind: "Exp.type"
  }

export const Type: Type = {
  kind: "Exp.type",
  repr: () => "Type",
  evaluability: (_) => Value.type,
}

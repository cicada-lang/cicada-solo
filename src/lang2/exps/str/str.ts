import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Str = Evaluable &
  Repr & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  repr: () => "String",
  evaluability: (_) => Value.str,
}

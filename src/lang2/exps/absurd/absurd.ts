import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Absurd = Evaluable & {
  kind: "Exp.absurd"
}

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  evaluability: (_) => Value.absurd,
}

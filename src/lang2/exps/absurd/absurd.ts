import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import * as Value from "../../value"

export type Absurd = Evaluable &
  Repr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  evaluability: (_) => Value.absurd,
  repr: () => "Absurd",
}

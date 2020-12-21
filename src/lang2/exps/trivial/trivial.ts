import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"

export type Trivial = Evaluable &
  Repr & {
    kind: "Exp.trivial"
  }

export const Trivial: Trivial = {
  kind: "Exp.trivial",
  repr: () => "Trivial",
  evaluability: ({ env }) => Value.trivial,
}

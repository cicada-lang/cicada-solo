import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"

export type Trivial = Evaluable & {
  kind: "Exp.trivial"
}

export const Trivial: Trivial = {
  kind: "Exp.trivial",
  evaluability: ({ env }) => Value.trivial,
}

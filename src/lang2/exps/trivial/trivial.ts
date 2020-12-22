import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Trivial = Exp & {
    kind: "Exp.trivial"
  }

export const Trivial: Trivial = {
  kind: "Exp.trivial",
  evaluability: ({ env }) => Value.trivial,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Trivial",
  alpha_repr: () => "Trivial",
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import * as Value from "../../value"
import { AlphaRepr } from "../../alpha-repr"

export type Absurd = Evaluable &
  Checkable &
  Inferable &
  Repr &
  AlphaRepr & {
    kind: "Exp.absurd"
  }

export const Absurd: Absurd = {
  kind: "Exp.absurd",
  evaluability: (_) => Value.absurd,
  ...Inferable({
    inferability: ({ ctx }) => Value.type,
  }),
  repr: () => "Absurd",
  alpha_repr: (opts) => "Absurd",
}

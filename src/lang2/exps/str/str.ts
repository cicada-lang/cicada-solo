import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Str = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  evaluability: (_) => Value.str,
  repr: () => "String",
  alpha_repr: () => "String",
}

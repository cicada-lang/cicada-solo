import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { type_evaluable } from "./type-evaluable"
import { type_inferable } from "./type-inferable"

export type Type = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
    kind: "Exp.type"
  }

export const Type: Type = {
  kind: "Exp.type",
  ...type_evaluable,
  ...type_inferable,
  repr: () => "Type",
  alpha_repr: (opts) => "Type",
}

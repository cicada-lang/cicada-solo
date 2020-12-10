import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { type_evaluable } from "./type-evaluable"

export type Type = Evaluable &
  Repr & {
    kind: "Exp.type"
  }

export const Type: Type = {
  kind: "Exp.type",
  ...type_evaluable,
  repr: () => "Type",
}

import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { type_evaluable } from "./type-evaluable"
import { type_inferable } from "./type-inferable"

export type Type = Evaluable &
  Inferable &
  Repr & {
    kind: "Exp.type"
  }

export const Type: Type = {
  kind: "Exp.type",
  ...type_evaluable,
  ...type_inferable,
  repr: () => "Type",
}

import { Exp } from "../../exp"
import { type_evaluable } from "./type-evaluable"
import { type_inferable } from "./type-inferable"

export type Type = Exp & {
  kind: "Exp.type"
}

export const Type: Type = {
  kind: "Exp.type",
  ...type_evaluable,
  ...type_inferable,
  repr: () => "Type",
  alpha_repr: (opts) => "Type",
}

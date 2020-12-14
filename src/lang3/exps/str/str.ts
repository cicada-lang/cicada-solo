import { Exp } from "../../exp"
import { str_evaluable } from "./str-evaluable"
import { str_inferable } from "./str-inferable"

export type Str = Exp & {
  kind: "Exp.str"
}

export const Str: Str = {
  kind: "Exp.str",
  ...str_evaluable,
  ...str_inferable,
  repr: () => "String",
  alpha_repr: (opts) => "String",
}

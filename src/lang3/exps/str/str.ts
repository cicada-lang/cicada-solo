import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import { AlphaRepr } from "../../alpha-repr"
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

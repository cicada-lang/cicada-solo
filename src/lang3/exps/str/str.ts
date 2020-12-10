import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { str_evaluable } from "./str-evaluable"

export type Str = Evaluable &
  Repr & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  ...str_evaluable,
  repr: () => "String",
}

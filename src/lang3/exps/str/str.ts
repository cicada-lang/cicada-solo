import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { str_evaluable } from "./str-evaluable"
import { str_inferable } from "./str-inferable"

export type Str = Evaluable &
  Inferable &
  Checkable &
  Repr & {
    kind: "Exp.str"
  }

export const Str: Str = {
  kind: "Exp.str",
  ...str_evaluable,
  ...str_inferable,
  repr: () => "String",
}

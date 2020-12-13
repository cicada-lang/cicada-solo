import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { alpha_repr } from "../../exp/exp-alpha-repr"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { var_evaluable } from "./var-evaluable"
import { var_inferable } from "./var-inferable"

export type Var = Evaluable &
  Inferable &
  Checkable &
  Repr & {
    kind: "Exp.v"
    name: string
  }

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    repr: () => name,
    ...var_evaluable(name),
    ...var_inferable(name),
  }
}

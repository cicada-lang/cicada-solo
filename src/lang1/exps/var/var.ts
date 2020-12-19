import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { var_evaluable } from "./var-evaluable"
import { var_inferable } from "./var-inferable"

export type Var = Evaluable &
  Inferable &
  Repr & {
    kind: "Exp.v"
    name: string
  }

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    ...var_evaluable(name),
    ...var_inferable(name),
    repr: () => name,
  }
}

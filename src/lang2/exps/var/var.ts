import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { var_evaluable } from "./var-evaluable"
export type Var = Evaluable &
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
  }
}

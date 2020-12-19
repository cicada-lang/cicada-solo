import { Evaluable } from "../../evaluable"
import { var_evaluable } from "./var-evaluable"

export type Var = Evaluable & {
  kind: "Exp.v"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    ...var_evaluable(name),
  }
}

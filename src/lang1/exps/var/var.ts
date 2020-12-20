import { Exp } from "../../exp"
import { var_evaluable } from "./var-evaluable"
import { var_inferable } from "./var-inferable"

export type Var = Exp & {
  kind: "Var"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Var",
    name,
    ...var_evaluable(name),
    ...var_inferable(name),
    repr: () => name,
  }
}

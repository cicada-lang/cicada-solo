import { Evaluable } from "../evaluable"

export type Var = {
  kind: "Exp.v"
  name: string
}

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
  }
}

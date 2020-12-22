import { Exp } from "../../exp"
import { var_evaluable } from "./var-evaluable"
import { var_inferable } from "./var-inferable"

export type Var = Exp & {
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
    alpha_repr: (opts) => {
      const depth = opts.depths.get(name)
      if (depth === undefined) return name
      return `[${depth}]`
    },
  }
}

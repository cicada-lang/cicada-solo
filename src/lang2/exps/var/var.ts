import { Evaluable } from "../../evaluable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { var_evaluable } from "./var-evaluable"
export type Var = Evaluable &
  Repr &
  AlphaRepr & {
    kind: "Exp.v"
    name: string
  }

export function Var(name: string): Var {
  return {
    kind: "Exp.v",
    name,
    ...var_evaluable(name),
    repr: () => name,
    alpha_repr: (opts) => {
      const depth = opts.depths.get(name)
      if (depth === undefined) return name
      return `[${depth}]`
    },
  }
}

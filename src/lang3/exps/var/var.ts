import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { var_evaluable } from "./var-evaluable"
import { var_inferable } from "./var-inferable"

export type Var = Evaluable &
  Inferable &
  Checkable &
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
    ...var_inferable(name),
    repr: () => name,
    alpha_repr: (opts) => {
      const depth = opts.depths.get(name)
      if (depth === undefined) return name
      else return depth.toString()
    },
  }
}

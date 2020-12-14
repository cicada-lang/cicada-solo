import { Exp } from "../../exp"
import { dot_evaluable } from "./dot-evaluable"
import { dot_inferable } from "./dot-inferable"

export type Dot = Exp & {
  kind: "Exp.dot"
  target: Exp
  name: string
}

export function Dot(target: Exp, name: string): Dot {
  return {
    kind: "Exp.dot",
    target,
    name,
    ...dot_evaluable(target, name),
    ...dot_inferable(target, name),
    repr: () => `${target.repr()}.${name}`,
    alpha_repr: (opts) => `${target.alpha_repr(opts)}.${name}`,
  }
}

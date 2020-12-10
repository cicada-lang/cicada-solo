import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { dot_evaluable } from "./dot-evaluable"

export type Dot = Evaluable &
  Repr & {
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
    repr: () => `${target.repr()}.${name}`,
  }
}

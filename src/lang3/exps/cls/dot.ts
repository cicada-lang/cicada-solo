import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { dot_evaluable } from "./dot-evaluable"
import { dot_inferable } from "./dot-inferable"

export type Dot = Evaluable &
  Inferable &
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
    ...dot_inferable(target, name),
    repr: () => `${target.repr()}.${name}`,
  }
}

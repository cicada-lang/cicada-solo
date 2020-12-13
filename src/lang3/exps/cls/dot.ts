import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { dot_evaluable } from "./dot-evaluable"
import { dot_inferable } from "./dot-inferable"

export type Dot = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
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

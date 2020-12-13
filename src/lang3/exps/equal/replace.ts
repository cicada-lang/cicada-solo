import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"
import { replace_evaluable } from "./replace-evaluable"
import { replace_inferable } from "./replace-inferable"

export type Replace = Evaluable &
  Inferable &
  Checkable &
  Repr &
  AlphaRepr & {
    kind: "Exp.replace"
    target: Exp
    motive: Exp
    base: Exp
  }

export function Replace(target: Exp, motive: Exp, base: Exp): Replace {
  return {
    kind: "Exp.replace",
    target,
    motive,
    base,
    ...replace_evaluable(target, motive, base),
    ...replace_inferable(target, motive, base),
    repr: () => `replace(${target.repr()}, ${motive.repr()}, ${base.repr()})`,
    alpha_repr: (opts) => {
      const target_repr = target.alpha_repr(opts)
      const motive_repr = motive.alpha_repr(opts)
      const base_repr = base.alpha_repr(opts)
      return `replace(${target_repr}, ${motive_repr}, ${base_repr})`
    },
  }
}

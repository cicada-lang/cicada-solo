import { Exp } from "../../exp"
import { replace_evaluable } from "./replace-evaluable"
import { replace_inferable } from "./replace-inferable"

export type Replace = Exp & {
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

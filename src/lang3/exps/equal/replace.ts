import { Evaluable } from "../../evaluable"
import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { replace_evaluable } from "./replace-evaluable"
import { replace_inferable } from "./replace-inferable"

export type Replace = Evaluable &
  Inferable &
  Repr & {
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
  }
}

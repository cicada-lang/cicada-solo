import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import { Repr } from "../../repr"
import { replace_evaluable } from "./replace-evaluable"

export type Replace = Evaluable &
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
    repr: () => `replace(${target.repr()}, ${motive.repr()}, ${base.repr()})`,
  }
}

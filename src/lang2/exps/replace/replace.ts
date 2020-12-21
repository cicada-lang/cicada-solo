import { Exp } from "../../exp"

export type Replace = {
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
  }
}

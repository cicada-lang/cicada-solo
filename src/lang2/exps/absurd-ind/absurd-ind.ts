import { Exp } from "../../exp"

export type AbsurdInd = {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "Exp.absurd_ind",
    target,
    motive,
  }
}

import { Exp } from "../../exp"

export type NatInd = {
  kind: "Exp.nat_ind"
  target: Exp
  motive: Exp
  base: Exp
  step: Exp
}

export function NatInd(target: Exp, motive: Exp, base: Exp, step: Exp): NatInd {
  return {
    kind: "Exp.nat_ind",
    target,
    motive,
    base,
    step,
  }
}

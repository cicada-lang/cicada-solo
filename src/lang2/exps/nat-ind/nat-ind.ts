import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_nat_ind } from "../../evaluate"

export type NatInd = Evaluable & {
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
    evaluability: ({ env }) =>
      do_nat_ind(
        evaluate(env, target),
        evaluate(env, motive),
        evaluate(env, base),
        evaluate(env, step)
      ),
  }
}

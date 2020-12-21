import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate, do_absurd_ind } from "../../evaluate"
import * as Value from "../../value"

export type AbsurdInd = Evaluable & {
  kind: "Exp.absurd_ind"
  target: Exp
  motive: Exp
}

export function AbsurdInd(target: Exp, motive: Exp): AbsurdInd {
  return {
    kind: "Exp.absurd_ind",
    target,
    motive,
    evaluability: ({ env }) =>
      do_absurd_ind(evaluate(env, target), evaluate(env, motive)),
  }
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"

export type Equal = Evaluable & {
  kind: "Exp.equal"
  t: Exp
  from: Exp
  to: Exp
}

export function Equal(t: Exp, from: Exp, to: Exp): Equal {
  return {
    kind: "Exp.equal",
    t,
    from,
    to,
    evaluability: ({ env }) =>
      Value.equal(evaluate(env, t), evaluate(env, from), evaluate(env, to)),
  }
}

import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { repr } from "../../exp"

export type Equal = Evaluable &
  Repr & {
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
    repr: () => `Equal(${repr(t)}, ${repr(from)}, ${repr(to)})`,
    evaluability: ({ env }) =>
      Value.equal(evaluate(env, t), evaluate(env, from), evaluate(env, to)),
  }
}

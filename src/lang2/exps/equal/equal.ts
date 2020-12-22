import { Exp } from "../../exp"
import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import * as Value from "../../value"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type Equal = Evaluable &
  Repr &
  AlphaRepr & {
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
    repr: () => `Equal(${t.repr()}, ${from.repr()}, ${to.repr()})`,
    alpha_repr: (opts) =>
      `Equal(${t.alpha_repr(opts)}, ${from.alpha_repr(opts)}, ${to.alpha_repr(
        opts
      )})`,
  }
}

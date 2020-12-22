import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import { Evaluable } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { Repr } from "../../repr"
import { AlphaRepr } from "../../alpha-repr"

export type The = Exp & {
    kind: "Exp.the"
    t: Exp
    exp: Exp
  }

export function The(t: Exp, exp: Exp): The {
  return {
    kind: "Exp.the",
    t,
    exp,
    evaluability: ({ env }) => evaluate(env, exp),
    ...Inferable({
      inferability: ({ ctx }) => {
        check(ctx, t, Value.type)
        const t_value = evaluate(Ctx.to_env(ctx), t)
        check(ctx, exp, t_value)
        return t_value
      },
    }),
    repr: () => `{ ${t.repr()} -- ${exp.repr()} }`,
    alpha_repr: (opts) =>
      `{ ${t.alpha_repr(opts)} -- ${exp.alpha_repr(opts)} }`,
  }
}

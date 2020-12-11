import { Inferable } from "../../inferable"
import { evaluator } from "../../evaluator"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Check from "../../check"

export const equal_inferable = (t: Exp, from: Exp, to: Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      Check.check(mod, ctx, t, Value.type)
      const t_value = evaluator.evaluate(t, { mod, env: Ctx.to_env(ctx) })
      Check.check(mod, ctx, from, t_value)
      Check.check(mod, ctx, to, t_value)
      return Value.type
    },
  })

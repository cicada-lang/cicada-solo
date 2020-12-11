import { Inferable } from "../../inferable"
import { evaluator } from "../../evaluator"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Check from "../../check"

export function the_inferable(t: Exp, exp: Exp): Inferable {
  return Inferable({
    inferability: ({ mod, ctx }) => {
      Check.check(mod, ctx, t, Value.type)
      const u = evaluator.evaluate(t, { mod, env: Ctx.to_env(ctx) })
      Check.check(mod, ctx, exp, u)
      return u
    },
  })
}

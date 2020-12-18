import { Inferable } from "../../inferable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Check from "../../check"

export const the_inferable = (t: Exp, exp: Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      Check.check(mod, ctx, t, Value.type)
      const u = evaluate(t, { mod, env: Ctx.to_env(ctx) })
      Check.check(mod, ctx, exp, u)
      return u
    },
  })

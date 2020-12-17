import { Inferable } from "../../inferable"
import { evaluator } from "../../evaluator"
import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Evaluate from "../../evaluate"
import * as Infer from "../../infer"
import * as Check from "../../check"
import * as Env from "../../env"
import * as Ctx from "../../ctx"

export const replace_inferable = (
  target: Exp.Exp,
  motive: Exp.Exp,
  base: Exp.Exp
) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      const target_t = Infer.infer(mod, ctx, target)
      const equal = Value.is_equal(mod, ctx, target_t)
      const motive_t = evaluator.evaluate(Exp.pi("x", Exp.v("t"), Exp.type), {
        mod,
        env: Env.update(Env.init(), "t", equal.t),
      })
      Check.check(mod, ctx, motive, motive_t)
      const motive_value = evaluator.evaluate(motive, {
        mod,
        env: Ctx.to_env(ctx),
      })
      Check.check(mod, ctx, base, Evaluate.do_ap(motive_value, equal.from))
      return Evaluate.do_ap(motive_value, equal.to)
    },
  })

import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_replace(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  replace: Exp.replace
): Value.Value {
  const target_t = Infer.infer(mod, ctx, replace.target)
  const equal = Value.is_equal(mod, ctx, target_t)
  const motive_t = evaluator.evaluate(Exp.pi("x", Exp.v("t"), Exp.type), {
    mod,
    env: Env.update(Env.init(), "t", equal.t),
  })
  Check.check(mod, ctx, replace.motive, motive_t)
  const motive = evaluator.evaluate(replace.motive, {
    mod,
    env: Ctx.to_env(ctx),
  })
  Check.check(mod, ctx, replace.base, Evaluate.do_ap(motive, equal.from))
  return Evaluate.do_ap(motive, equal.to)
}

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
  const target_t = Exp.infer(mod, ctx, replace.target)
  const equal = Value.is_equal(mod, ctx, target_t)
  const motive_t = Evaluate.evaluate(
    mod,
    Env.update(Env.init(), "t", equal.t),
    Exp.pi("x", Exp.v("t"), Exp.type)
  )
  Check.check(mod, ctx, replace.motive, motive_t)
  const motive = Evaluate.evaluate(mod, Ctx.to_env(ctx), replace.motive)
  Check.check(mod, ctx, replace.base, Evaluate.do_ap(motive, equal.from))
  return Evaluate.do_ap(motive, equal.to)
}

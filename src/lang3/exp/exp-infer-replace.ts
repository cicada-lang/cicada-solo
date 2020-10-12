import * as Exp from "../exp"
import * as Value from "../value"
import * as Env from "../env"
import * as Ctx from "../ctx"

export function infer_replace(ctx: Ctx.Ctx, replace: Exp.replace): Value.Value {
  const target_t = Exp.infer(ctx, replace.target)
  const equal = Value.is_equal(ctx, target_t)
  const motive_t = Exp.evaluate(
    Env.update(Env.init(), "t", equal.t),
    Exp.pi("x", Exp.v("t"), Exp.type)
  )
  Exp.check(ctx, replace.motive, motive_t)
  const motive = Exp.evaluate(Ctx.to_env(ctx), replace.motive)
  Exp.check(ctx, replace.base, Exp.do_ap(motive, equal.from))
  return Exp.do_ap(motive, equal.to)
}

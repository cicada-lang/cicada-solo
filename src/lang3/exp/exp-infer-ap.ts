import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_ap(mod: Mod.Mod, ctx: Ctx.Ctx, ap: Exp.ap): Value.Value {
  const target_t = Exp.infer(mod, ctx, ap.target)
  const pi = Value.is_pi(mod, ctx, target_t)
  Exp.check(mod, ctx, ap.arg, pi.arg_t)
  const arg = Exp.evaluate(mod, Ctx.to_env(ctx), ap.arg)
  return Closure.apply(pi.ret_t_cl, arg)
}

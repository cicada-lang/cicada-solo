import * as Exp from "../exp"
import * as Value from "../value"
import * as Closure from "../closure"
import * as Ctx from "../ctx"

export function infer_ap(ctx: Ctx.Ctx, ap: Exp.ap): Value.Value {
  const target_t = Exp.infer(ctx, ap.target)
  const pi = Value.is_pi(ctx, target_t)
  Exp.check(ctx, ap.arg, pi.arg_t)
  const arg = Exp.evaluate(Ctx.to_env(ctx), ap.arg)
  return Closure.apply(pi.ret_t_cl, arg)
}

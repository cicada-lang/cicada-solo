import * as Exp from "../exp"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Closure from "../closure"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function check_fn(mod: Mod.Mod, ctx: Ctx.Ctx, fn: Exp.fn, pi: Value.pi): void {
  const arg = Value.not_yet(pi.arg_t, Neutral.v(fn.name))
  const ret_t = Closure.apply(pi.ret_t_cl, arg)
  Exp.check(mod, Ctx.extend(ctx, fn.name, pi.arg_t), fn.ret, ret_t)
}

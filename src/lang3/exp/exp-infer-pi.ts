import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_pi(mod: Mod.Mod, ctx: Ctx.Ctx, pi: Exp.pi): Value.type {
  Exp.check(mod, ctx, pi.arg_t, Value.type)
  const arg_t = Exp.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)
  ctx = Ctx.extend(ctx, pi.name, arg_t)
  Exp.check(mod, ctx, pi.ret_t, Value.type)
  return Value.type
}

import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_pi(mod: Mod.Mod, ctx: Ctx.Ctx, pi: Exp.pi): Value.type {
  Exp.check(mod, ctx, pi.arg_t, Value.type)
  Exp.check(
    mod,
    Ctx.extend(ctx, pi.name, Exp.evaluate(mod, Ctx.to_env(ctx), pi.arg_t)),
    pi.ret_t,
    Value.type
  )
  return Value.type
}

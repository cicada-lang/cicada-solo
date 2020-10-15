import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as ut from "../../ut"

export function readback_type_pi(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi
): Exp.Exp {
  const fresh_name = ut.freshen_name(
    new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
    pi.ret_t_cl.name
  )
  const variable = Value.not_yet(pi.arg_t, Neutral.v(fresh_name))
  const arg_t = Value.readback(mod, ctx, Value.type, pi.arg_t)
  const ret_t = Value.readback(
    mod,
    Ctx.extend(ctx, fresh_name, pi.arg_t),
    Value.type,
    Value.Closure.apply(pi.ret_t_cl, variable)
  )
  return Exp.pi(fresh_name, arg_t, ret_t)
}

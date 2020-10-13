import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_pi(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi,
  value: Value.Value
): Exp.Exp {
  // NOTE everything with a function type
  //   is immediately read back as having a Lambda on top.
  //   This implements the η-rule for functions.
  const fresh_name = ut.freshen_name(
    new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
    pi.ret_t_cl.name
  )
  const variable = Value.not_yet(pi.arg_t, Neutral.v(fresh_name))
  return Exp.fn(
    fresh_name,
    Value.readback(
      mod,
      Ctx.extend(ctx, fresh_name, pi.arg_t),
      Closure.apply(pi.ret_t_cl, variable),
      Exp.do_ap(value, variable)
    )
  )
}

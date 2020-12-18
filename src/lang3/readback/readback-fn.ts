import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Pattern from "../pattern"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as ut from "../../ut"
import { do_ap } from "../exps/ap"

export function readback_fn(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi,
  value: Value.Value
): Exp.fn {
  // NOTE everything with a function type
  //   is immediately read back as having a Lambda on top.
  //   This implements the η-rule for functions.
  const fresh_name = ut.freshen_name(
    new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
    Value.pi_arg_name(pi)
  )
  const variable = Value.not_yet(pi.arg_t, Neutral.v(fresh_name))
  return Exp.fn(
    Pattern.v(fresh_name),
    Readback.readback(
      mod,
      Ctx.extend(ctx, fresh_name, pi.arg_t),
      Value.Closure.apply(pi.ret_t_cl, variable),
      do_ap(value, variable)
    )
  )
}

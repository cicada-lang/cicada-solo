import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as ut from "../../ut"
import * as Trace from "../../trace"
import strip_ansi from "strip-ansi"

export function readback_data(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  data: Value.data
): Exp.Exp {
  if (!Value.conversion(mod, ctx, Value.type, t, data.t))
    throw new Trace.Trace("t is not equivalent to data.t")

  let exp: Exp.Exp = Exp.v(data.data_constructor.tag)
  let remain_t = data.data_constructor.t
  for (const arg of data.args) {
    const pi = Value.is_pi(mod, ctx, remain_t)
    exp = Exp.ap(exp, Value.readback(mod, ctx, pi.arg_t, arg))
    remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
  }

  return exp
}

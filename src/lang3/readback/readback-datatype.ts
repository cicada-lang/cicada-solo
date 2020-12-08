import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as ut from "../../ut"
import * as Trace from "../../trace"

export function readback_datatype(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  datatype: Value.datatype
): Exp.Exp {
  if (!Value.conversion(mod, ctx, Value.type, t, datatype.t))
    throw new Trace.Trace("t is not equivalent to datatype.t")

  let exp: Exp.Exp = Exp.v(datatype.typecons.name)
  let remain_t = datatype.typecons.t
  for (const arg of datatype.args) {
    const pi = Value.is_pi(mod, ctx, remain_t)
    exp = Exp.ap(exp, Readback.readback(mod, ctx, pi.arg_t, arg))
    remain_t = Value.Closure.apply(pi.ret_t_cl, arg)
  }

  return exp
}

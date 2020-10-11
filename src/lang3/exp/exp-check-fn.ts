import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_fn(ctx: Ctx.Ctx, fn: Exp.fn, pi: Value.pi): void {
  const arg = Value.not_yet(pi.arg_t, Neutral.v(fn.name))
  const ret_t = Closure.apply(pi.ret_t_cl, arg)
  Exp.check(Ctx.extend(ctx, fn.name, pi.arg_t), fn.ret, ret_t)
}

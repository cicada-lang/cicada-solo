import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_pi(ctx: Ctx.Ctx, pi: Exp.pi): Value.Value {
  Exp.check(ctx, pi.arg_t, Value.type)
  const arg_t = Exp.evaluate(Ctx.to_env(ctx), pi.arg_t)
  ctx = Ctx.extend(ctx, pi.name, arg_t)
  Exp.check(ctx, pi.ret_t, Value.type)
  return Value.type
}

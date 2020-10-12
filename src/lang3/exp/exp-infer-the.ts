import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_the(ctx: Ctx.Ctx, the: Exp.the): Value.Value {
  Exp.check(ctx, the.t, Value.type)
  const t = Exp.evaluate(Ctx.to_env(ctx), the.t)
  Exp.check(ctx, the.exp, t)
  return t
}

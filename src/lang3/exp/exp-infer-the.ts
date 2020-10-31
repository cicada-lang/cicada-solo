import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_the(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  the: Exp.the
): Value.Value {
  Exp.check(mod, ctx, the.t, Value.type)
  const t = Evaluate.evaluate(mod, Ctx.to_env(ctx), the.t)
  Exp.check(mod, ctx, the.exp, t)
  return t
}

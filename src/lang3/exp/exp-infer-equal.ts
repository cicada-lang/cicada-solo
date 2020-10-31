import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_equal(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  equal: Exp.equal
): Value.type {
  Exp.check(mod, ctx, equal.t, Value.type)
  const t = Evaluate.evaluate(mod, Ctx.to_env(ctx), equal.t)
  Exp.check(mod, ctx, equal.from, t)
  Exp.check(mod, ctx, equal.to, t)
  return Value.type
}

import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
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
  Check.check(mod, ctx, the.t, Value.type)
  const t = evaluator.evaluate(the.t, { mod, env: Ctx.to_env(ctx) })
  Check.check(mod, ctx, the.exp, t)
  return t
}

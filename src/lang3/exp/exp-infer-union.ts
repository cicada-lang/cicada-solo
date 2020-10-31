import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_union(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  union: Exp.union
): Value.type {
  Check.check(mod, ctx, union.left, Value.type)
  Check.check(mod, ctx, union.right, Value.type)
  return Value.type
}

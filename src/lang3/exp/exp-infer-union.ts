import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_union(ctx: Ctx.Ctx, union: Exp.union): Value.Value {
  Exp.check(ctx, union.left, Value.type)
  Exp.check(ctx, union.right, Value.type)
  return Value.type
}

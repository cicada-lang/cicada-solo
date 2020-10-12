import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_union(ctx: Ctx.Ctx, union: Exp.union): Value.Value {
  Exp.check(ctx, union.left, Value.type)
  Exp.check(ctx, union.right, Value.type)
  return Value.type
}

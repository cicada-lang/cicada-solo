import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_begin(ctx: Ctx.Ctx, begin: Exp.begin): Value.Value {
  ctx = Ctx.clone(ctx)
  for (const stmt of begin.stmts) {
    Stmt.declare(ctx, stmt)
  }
  return Exp.infer(ctx, begin.ret)
}

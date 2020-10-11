import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function check_begin(
  ctx: Ctx.Ctx,
  begin: Exp.begin,
  t: Value.Value
): void {
  const { stmts, ret } = begin
  ctx = Ctx.clone(ctx)
  for (const stmt of stmts) {
    Stmt.declare(ctx, stmt)
  }
  Exp.check(ctx, ret, t)
}

import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function check_begin(
  ctx: Ctx.Ctx,
  begin: Exp.begin,
  t: Value.Value
): void {
  ctx = Ctx.clone(ctx)
  for (const stmt of begin.stmts) {
    Stmt.declare(ctx, stmt)
  }
  Exp.check(ctx, begin.ret, t)
}

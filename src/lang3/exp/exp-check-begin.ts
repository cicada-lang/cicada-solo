import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function check_begin(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  begin: Exp.begin,
  t: Value.Value
): void {
  ctx = Ctx.clone(ctx)
  for (const stmt of begin.stmts) {
    Stmt.declare(ctx, stmt)
  }
  Exp.check(mod, ctx, begin.ret, t)
}

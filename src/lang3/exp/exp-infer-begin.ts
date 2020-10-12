import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_begin(mod: Mod.Mod, ctx: Ctx.Ctx, begin: Exp.begin): Value.Value {
  ctx = Ctx.clone(ctx)
  for (const stmt of begin.stmts) {
    Stmt.declare(mod, ctx, stmt)
  }
  return Exp.infer(mod, ctx, begin.ret)
}

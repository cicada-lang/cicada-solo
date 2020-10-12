import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Exp from "../exp"

export function declare(mod: Mod.Mod, ctx: Ctx.Ctx, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      Ctx.update(
        ctx,
        name,
        Exp.infer(mod, ctx, exp),
        Exp.evaluate(mod, Ctx.to_env(ctx), exp)
      )
    }
  }
}

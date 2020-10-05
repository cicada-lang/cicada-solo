import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Exp from "../exp"

export function declare(ctx: Ctx.Ctx, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      Ctx.update(
        ctx,
        name,
        Exp.infer(ctx, exp),
        Exp.evaluate(Ctx.to_env(ctx), exp)
      )
    }
  }
}

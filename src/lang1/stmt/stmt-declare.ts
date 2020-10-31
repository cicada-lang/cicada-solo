import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Exp from "../exp"
import * as Infer from "../infer"

export function declare(ctx: Ctx.Ctx, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      const { name, exp } = stmt
      Ctx.update(ctx, name, Infer.infer(ctx, exp))
    }
  }
}

import { evaluate } from "../evaluate"
import * as Stmt from "../stmt"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Exp from "../exp"

import * as Infer from "../infer"

export function declare(mod: Mod.Mod, ctx: Ctx.Ctx, stmt: Stmt.Stmt): void {
  switch (stmt.kind) {
    case "Stmt.def": {
      Ctx.update(
        ctx,
        stmt.name,
        Infer.infer(mod, ctx, stmt.exp),
        evaluate(stmt.exp, { mod, env: Ctx.to_env(ctx) })
      )
    }
  }
}

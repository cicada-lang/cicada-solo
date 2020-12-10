import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import * as Check from "../../check"
import * as Stmt from "../../stmt"
import * as Ctx from "../../ctx"

export function begin_checkable(stmts: Array<Stmt.Stmt>, ret: Exp): Checkable {
  return Checkable({
    checkability: (t, { mod, ctx }) => {
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(mod, ctx, stmt)
      }
      Check.check(mod, ctx, ret, t)
    },
  })
}

import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as Ctx from "../../ctx"
import { Checkable } from "../../checkable"
import { check } from "../../check"

export const begin_checkable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Checkable({
    checkability: (t, { ctx }) => {
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      check(new_ctx, ret, t)
    },
  })

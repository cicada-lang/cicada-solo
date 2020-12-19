import { Checkable } from "../../checkable"
import { Exp } from "../../exp"
import { check } from "../../check"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Ctx from "../../ctx"

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

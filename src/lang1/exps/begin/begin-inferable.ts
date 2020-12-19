import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import { infer } from "../../infer"
import * as Stmt from "../../stmt"
import * as Ctx from "../../ctx"

export const begin_inferable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Inferable({
    inferability: ({ ctx }) => {
      const new_ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(new_ctx, stmt)
      }
      return infer(new_ctx, ret)
    },
  })

import { Inferable } from "../../inferable"
import { Exp } from "../../exp"
import * as Infer from "../../infer"
import * as Stmt from "../../stmt"
import * as Ctx from "../../ctx"

export const begin_inferable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Inferable({
    inferability: ({ mod, ctx }) => {
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(mod, ctx, stmt)
      }
      return Infer.infer(mod, ctx, ret)
    },
  })

import { Evaluable } from "../../evaluable"
import { evaluate } from "../../evaluate"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as Env from "../../env"

export const begin_evaluable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Evaluable({
    evaluability: ({ env }) => {
        const env_new = Env.clone(env)
        for (const stmt of stmts) {
          Stmt.execute(env_new, stmt)
        }
        return evaluate(env_new, ret)
      },
  })

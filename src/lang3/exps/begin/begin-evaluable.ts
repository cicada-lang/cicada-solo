import { Evaluable } from "../../evaluable"
import { Exp } from "../../exp"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import { evaluate } from "../../evaluable"

export const begin_evaluable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode }) => {
      env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(mod, env, stmt)
      }
      return evaluate(ret, { mod, env, mode })
    },
  })

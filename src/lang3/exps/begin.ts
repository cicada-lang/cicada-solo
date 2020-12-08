import { Evaluable, EvaluationMode } from "../evaluable"
import { Exp } from "../exp"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Trace from "../../trace"

export type Begin = Evaluable & {
  kind: "Exp.begin"
  stmts: Array<Stmt.Stmt>
  ret: Exp
}

export function Begin(stmts: Array<Stmt.Stmt>, ret: Exp): Begin {
  return {
    kind: "Exp.begin",
    stmts,
    ret,
    evaluability: ({ mod, env, mode }) => {
      env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(mod, env, stmt)
      }
      return Evaluate.evaluate(mod, env, ret, { mode })
    },
  }
}

import { Evaluable, EvaluationMode } from "../../evaluable"
import { Checkable } from "../../checkable"
import { Repr } from "../../repr"
import { Exp } from "../../exp"
import * as Evaluate from "../../evaluate"
import * as Check from "../../check"
import * as Explain from "../../explain"
import * as Value from "../../value"
import * as Neutral from "../../neutral"
import * as Mod from "../../mod"
import * as Stmt from "../../stmt"
import * as Env from "../../env"
import * as Ctx from "../../ctx"
import * as Trace from "../../../trace"
import * as ut from "../../../ut"

export const begin_evaluable = (stmts: Array<Stmt.Stmt>, ret: Exp) =>
  Evaluable({
    evaluability: ({ mod, env, mode, evaluator }) => {
      env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(mod, env, stmt)
      }
      return evaluator.evaluate(ret, { mod, env, mode })
    },
  })

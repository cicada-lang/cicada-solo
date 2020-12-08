import { Evaluable, EvaluationMode } from "../evaluable"
import { Repr } from "../repr"
import { Exp, repr } from "../exp"
import * as Evaluate from "../evaluate"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export type Begin = Evaluable &
  Repr & {
    kind: "Exp.begin"
    stmts: Array<Stmt.Stmt>
    ret: Exp
  }

export function Begin(stmts: Array<Stmt.Stmt>, ret: Exp): Begin {
  return {
    kind: "Exp.begin",
    stmts,
    ret,
    evaluability: ({ mod, env, mode, evaluator }) => {
      env = Env.clone(env)
      for (const stmt of stmts) {
        Stmt.execute(mod, env, stmt)
      }
      return evaluator.evaluate(ret, { mod, env, mode })
    },
    repr: () => {
      const s = [...stmts.map(Stmt.repr), repr(ret)].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}

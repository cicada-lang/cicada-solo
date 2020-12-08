import { Evaluable, EvaluationMode } from "../evaluable"
import { Checkable } from "../checkable"
import { Repr } from "../repr"
import { Exp } from "../exp"
import * as Evaluate from "../evaluate"
import * as Check from "../check"
import * as Explain from "../explain"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Mod from "../mod"
import * as Stmt from "../stmt"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export type Begin = Evaluable &
  Checkable &
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
    checkability: (t, { mod, ctx }) => {
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(mod, ctx, stmt)
      }
      Check.check(mod, ctx, ret, t)
    },
    repr: () => {
      const s = [...stmts.map(Stmt.repr), ret.repr()].join("\n")
      return `{\n${ut.indent(s, "  ")}\n}`
    },
  }
}

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
import { begin_evaluable } from "./begin-evaluable"

export function begin_checkable(stmts: Array<Stmt.Stmt>, ret: Exp): Checkable {
  return Checkable({
    checkability: (t, { mod, ctx }) => {
      ctx = Ctx.clone(ctx)
      for (const stmt of stmts) {
        Stmt.declare(mod, ctx, stmt)
      }
      Check.check(mod, ctx, ret, t)
    },
  })
}

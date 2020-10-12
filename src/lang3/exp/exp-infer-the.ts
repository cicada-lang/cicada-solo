import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_the(ctx: Ctx.Ctx, the: Exp.the): Value.Value {
  Exp.check(ctx, the.t, Value.type)
  const t = Exp.evaluate(Ctx.to_env(ctx), the.t)
  Exp.check(ctx, the.exp, t)
  return t
}

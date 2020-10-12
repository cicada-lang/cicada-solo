import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_equal(ctx: Ctx.Ctx, equal: Exp.equal): Value.Value {
  Exp.check(ctx, equal.t, Value.type)
  const t = Exp.evaluate(Ctx.to_env(ctx), equal.t)
  Exp.check(ctx, equal.from, t)
  Exp.check(ctx, equal.to, t)
  return Value.type
}

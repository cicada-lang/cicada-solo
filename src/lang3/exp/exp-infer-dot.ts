import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Env from "../env"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_dot(ctx: Ctx.Ctx, dot: Exp.dot): Value.Value {
  const target_t = Exp.infer(ctx, dot.target)
  const cls = Value.is_cls(ctx, target_t)
  return Exp.do_dot(cls, dot.name)
}

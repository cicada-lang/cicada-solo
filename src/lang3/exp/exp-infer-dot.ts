import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_dot(ctx: Ctx.Ctx, dot: Exp.dot): Value.Value {
  const target_t = Exp.infer(ctx, dot.target)
  const cls = Value.is_cls(ctx, target_t)
  return Exp.do_dot(cls, dot.name)
}

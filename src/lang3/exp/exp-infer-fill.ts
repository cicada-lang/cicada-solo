import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function infer_fill(ctx: Ctx.Ctx, fill: Exp.fill): Value.Value {
  Exp.check(ctx, fill.target, Value.type)
  const target = Exp.evaluate(Ctx.to_env(ctx), fill.target)
  const cls = Value.is_cls(ctx, target)
  const { next } = cls.tel
  if (next === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |The telescope of the cls is full.
        |`)
    )
  }
  Exp.check(ctx, fill.arg, next.t)
  return Value.type
}

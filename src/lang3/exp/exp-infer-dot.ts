import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function infer_dot(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  dot: Exp.dot
): Value.Value {
  const target_t = Exp.infer(mod, ctx, dot.target)
  if (target_t.kind === "Value.cls") {
    return Evaluate.do_dot(target_t, dot.name)
  }

  const target = Evaluate.evaluate(mod, Ctx.to_env(ctx), dot.target)
  if (target.kind === "Value.type_constructor") {
    const data_constructor = Evaluate.do_dot_type_constructor(target, dot.name)
    return data_constructor.t
  }

  throw new Trace.Trace(
    "expecting target to be of type Value.cls, or to be a type_constructor."
  )
}

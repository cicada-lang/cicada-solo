import { evaluator } from "../evaluator"
import * as Infer from "../infer"
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
  const target_t = Infer.infer(mod, ctx, dot.target)
  if (target_t.kind === "Value.cls") {
    return Evaluate.do_dot(target_t, dot.name)
  }

  const target = evaluator.evaluate(dot.target, { mod, env: Ctx.to_env(ctx) })
  if (target.kind === "Value.typecons") {
    const datacons = Evaluate.do_dot_typecons(target, dot.name)
    return datacons.t
  }

  throw new Trace.Trace(
    "expecting target to be of type Value.cls, or to be a typecons."
  )
}

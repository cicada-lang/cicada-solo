import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function readback_type_constructor(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  datatype: Value.type_constructor
): Exp.Exp {
  if (!Value.conversion(mod, ctx, Value.type, t, datatype.t))
    throw new Trace.Trace("t is not equivalent to datatype.t")

  return Exp.type_constructor(
    datatype.name,
    Value.readback(mod, ctx, Value.type, datatype.t),
    readback_delayed_sums(mod, ctx, datatype.delayed)
  )
}

function readback_delayed_sums(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  delayed: Value.DelayedSums.DelayedSums
): Array<{ tag: string; t: Exp.Exp }> {
  // TODO should we use `mod` or `delayed.mod`?
  return delayed.sums.map((sum) => ({
    tag: sum.tag,
    t: Value.readback(
      mod,
      ctx,
      Value.type,
      Exp.evaluate(delayed.mod, delayed.env, sum.t)
    ),
  }))
}

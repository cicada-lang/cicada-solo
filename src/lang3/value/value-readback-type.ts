import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { readback_type_cls } from "./value-readback-type-cls"
import { readback_type_pi } from "./value-readback-type-pi"

export function readback_type(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Exp.Exp {
  if (value.kind === "Value.str") return Exp.str
  if (value.kind === "Value.quote") return Exp.quote(value.str)
  if (value.kind === "Value.absurd") return Exp.absurd
  if (value.kind === "Value.equal")
    return Exp.equal(
      Value.readback(mod, ctx, Value.type, value.t),
      Value.readback(mod, ctx, value.t, value.from),
      Value.readback(mod, ctx, value.t, value.to)
    )
  if (value.kind === "Value.cls") return readback_type_cls(mod, ctx, value)
  if (value.kind === "Value.pi") return readback_type_pi(mod, ctx, value)
  if (value.kind === "Value.union")
    return Exp.union(
      Value.readback(mod, ctx, Value.type, value.left),
      Value.readback(mod, ctx, Value.type, value.right)
    )
  if (value.kind === "Value.type") return Exp.type
  if (value.kind === "Value.not_yet")
    // NOTE t and value.t are ignored here,
    //  maybe use them to debug.
    return Neutral.readback(mod, ctx, value.neutral)
  throw readback_type_error(value)
}

function readback_type_error<T>(value: Value.Value): Trace.Trace<T> {
  return new Trace.Trace(
    ut.aline(`
      |I can not readback type value: ${ut.inspect(value)},
      |`)
  )
}

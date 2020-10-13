import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { readback_union } from "./value-readback-union"
import { readback_pi } from "./value-readback-pi"
import { readback_cls } from "./value-readback-cls"
import { readback_type } from "./value-readback-type"

export function readback(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  value: Value.Value
): Exp.Exp {

  if (t.kind === "Value.union") return readback_union(mod, ctx, t, value)
  if (t.kind === "Value.pi") return readback_pi(mod, ctx, t, value)
  if (t.kind === "Value.cls") return readback_cls(mod, ctx, t, value)
  if (
    t.kind === "Value.absurd" &&
    value.kind === "Value.not_yet" &&
    value.t.kind === "Value.absurd"
  )
    return Exp.the(Exp.absurd, Neutral.readback(mod, ctx, value.neutral))
  if (t.kind === "Value.equal" && value.kind === "Value.same") return Exp.same
  if (t.kind === "Value.str" && value.kind === "Value.quote")
    return Exp.quote(value.str)
  if (
    t.kind === "Value.quote" &&
    value.kind === "Value.quote" &&
    value.str === t.str
  )
    return Exp.quote(value.str)
  if (t.kind === "Value.type") return readback_type(mod, ctx, value)
  if (value.kind === "Value.not_yet")
    // NOTE t and value.t are ignored here,
    //  maybe use them to debug.
    return Neutral.readback(mod, ctx, value.neutral)
  throw readback_error(t, value)
}

function readback_error<T>(t: Value.Value, value: Value.Value): Trace.Trace<T> {
  return new Trace.Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}

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
import { readback_quote } from "./value-readback-quote"
import { readback_type_cls } from "./value-readback-type-cls"
import { readback_type_pi } from "./value-readback-type-pi"

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
  if (t.kind === "Value.quote") return readback_quote(mod, ctx, t, value)
  if (t.kind === "Value.type" && value.kind === "Value.str") return Exp.str
  if (t.kind === "Value.type" && value.kind === "Value.quote")
    return Exp.quote(value.str)
  if (t.kind === "Value.type" && value.kind === "Value.absurd")
    return Exp.absurd
  if (t.kind === "Value.type" && value.kind === "Value.equal")
    return Exp.equal(
      Value.readback(mod, ctx, Value.type, value.t),
      Value.readback(mod, ctx, value.t, value.from),
      Value.readback(mod, ctx, value.t, value.to)
    )
  if (t.kind === "Value.type" && value.kind === "Value.cls")
    return readback_type_cls(mod, ctx, value)
  if (t.kind === "Value.type" && value.kind === "Value.pi")
    return readback_type_pi(mod, ctx, value)
  if (t.kind === "Value.type" && value.kind === "Value.union")
    return Exp.union(
      Value.readback(mod, ctx, Value.type, value.left),
      Value.readback(mod, ctx, Value.type, value.right)
    )
  if (t.kind === "Value.type" && value.kind === "Value.type") return Exp.type
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

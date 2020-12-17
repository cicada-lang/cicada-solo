import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_type(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  value: Value.Value
): Exp.Exp {
  if (value.kind === "Value.str") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.quote") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.absurd") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.equal") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.cls") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.pi") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.union") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.type") {
    return value.readback_as_type({ mod, ctx })
  }
  if (value.kind === "Value.not_yet") {
    // NOTE t and value.t are ignored here,
    //  maybe use them to debug.
    return Readback.readback_neutral(mod, ctx, value.neutral)
  }
  throw readback_type_error(value)
}

function readback_type_error<T>(value: Value.Value): Trace.Trace<T> {
  return new Trace.Trace(
    ut.aline(`
      |I can not readback type value: ${ut.inspect(value.kind)},
      |`)
  )
}

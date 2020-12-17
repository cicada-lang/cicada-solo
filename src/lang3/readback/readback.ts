import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { readback_union } from "./readback-union"
import { readback_fn } from "./readback-fn"
import { readback_case_fn } from "./readback-case-fn"
import { readback_obj } from "./readback-obj"
import { readback_typecons } from "./readback-typecons"
import { readback_datatype } from "./readback-datatype"
import { readback_datacons } from "./readback-datacons"
import { readback_data } from "./readback-data"

export function readback(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  value: Value.Value
): Exp.Exp {
  if (value.kind === "Value.typecons") {
    return readback_typecons(mod, ctx, t, value)
  }
  if (value.kind === "Value.datatype") {
    return readback_datatype(mod, ctx, t, value)
  }
  if (value.kind === "Value.datacons") {
    return readback_datacons(mod, ctx, t, value)
  }
  if (value.kind === "Value.data") {
    return readback_data(mod, ctx, t, value)
  }
  if (t.kind === "Value.union" && value.kind !== "Value.not_yet") {
    return readback_union(mod, ctx, t, value)
  }
  if (t.kind === "Value.pi" && value.kind === "Value.case_fn") {
    return readback_case_fn(mod, ctx, t, value)
  }
  if (t.kind === "Value.pi") {
    return readback_fn(mod, ctx, t, value)
  }
  if (t.kind === "Value.cls") {
    return readback_obj(mod, ctx, t, value)
  }
  if (
    t.kind === "Value.absurd" &&
    value.kind === "Value.not_yet" &&
    value.t.kind === "Value.absurd"
  ) {
    return Exp.the(
      Exp.absurd,
      Readback.readback_neutral(mod, ctx, value.neutral)
    )
  }
  if (t.kind === "Value.equal" && value.kind === "Value.same") {
    return Exp.same
  }
  if (t.kind === "Value.str" && value.kind === "Value.quote") {
    return Exp.quote(value.str)
  }
  if (
    t.kind === "Value.quote" &&
    value.kind === "Value.quote" &&
    value.str === t.str
  ) {
    return Exp.quote(value.str)
  }
  if (t.kind === "Value.type") {
    return t.typed_readback(value, { mod, ctx })
  }
  if (value.kind === "Value.not_yet") {
    // NOTE t and value.t are ignored here,
    //  maybe use them to debug.
    return Readback.readback_neutral(mod, ctx, value.neutral)
  }
  throw readback_error(t, value)
}

function readback_error<T>(t: Value.Value, value: Value.Value): Trace.Trace<T> {
  return new Trace.Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value.kind)},
      |of type: ${ut.inspect(t.kind)}.
      |`)
  )
}

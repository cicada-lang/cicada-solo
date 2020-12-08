import { evaluator } from "../evaluator"
import * as Readback from "../readback"
import * as Evaluate from "../evaluate"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"

export function readback_obj(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  cls: Value.cls,
  value: Value.Value
): Exp.Exp {
  // NOTE η-expanded every value with cls type to obj.
  const properties = new Map()
  readback_properties_from_sat(mod, ctx, properties, cls.sat, value)
  readback_properties_from_tel(mod, ctx, properties, cls.tel, value)
  return Exp.obj(properties)
}

function readback_properties_from_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  properties: Map<string, Exp.Exp>,
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>,
  value: Value.Value
): void {
  for (const entry of sat) {
    const name = entry.name
    const property_t = entry.t
    const property_value = Evaluate.do_dot(value, name)
    if (!Value.conversion(mod, ctx, property_t, property_value, entry.value)) {
      throw new Trace.Trace("property_value not equivalent to entry.value")
    }
    const property_exp = Readback.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    // NOTE no env update here, use the name already in env
  }
}

function readback_properties_from_tel(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  properties: Map<string, Exp.Exp>,
  tel: Value.Telescope.Telescope,
  value: Value.Value
): void {
  const env = Env.clone(tel.env)
  if (tel.next !== undefined) {
    const name = tel.next.name
    const property_t = tel.next.t
    const property_value = Evaluate.do_dot(value, name)
    const property_exp = Readback.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    Env.update(env, name, property_value)
  }
  for (const entry of tel.scope) {
    const name = entry.name
    const property_t = evaluator.evaluate(entry.t, { mod, env })
    const property_value = Evaluate.do_dot(value, name)
    const property_exp = Readback.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    Env.update(env, name, property_value)
  }
}

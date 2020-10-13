import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_obj(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  cls: Value.cls,
  value: Value.Value
): Exp.Exp {
  // NOTE η-expanded every value with cls type to obj.
  const properties = new Map()
  let env = Env.clone(cls.tel.env)
  for (const entry of cls.sat) {
    const name = entry.name
    const property_t = entry.t
    const property_value = Exp.do_dot(value, name)
    const property_exp = Value.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    // NOTE no env update here, use the name already in env
    //   Env.update(env, name, property_value)
  }
  if (cls.tel.next !== undefined) {
    const name = cls.tel.next.name
    const property_t = cls.tel.next.t
    const property_value = Exp.do_dot(value, name)
    const property_exp = Value.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    Env.update(env, name, property_value)
  }
  for (const entry of cls.tel.scope) {
    const name = entry.name
    const property_t = Exp.evaluate(mod, env, entry.t)
    const property_value = Exp.do_dot(value, name)
    const property_exp = Value.readback(mod, ctx, property_t, property_value)
    properties.set(name, property_exp)
    Env.update(env, name, property_value)
  }
  return Exp.obj(properties)
}

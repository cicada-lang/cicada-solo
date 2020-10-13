import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_cls(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  _t: Value.type,
  cls: Value.cls
): Exp.Exp {
  const { sat, tel } = cls
  const { next, scope } = tel
  let { env } = cls.tel
  env = Env.clone(env)
  ctx = Ctx.clone(ctx)
  const norm_sat = new Array()
  for (const entry of sat) {
    const name = entry.name
    const t = Value.readback(mod, ctx, Value.type, entry.t)
    const exp = Value.readback(mod, ctx, entry.t, entry.value)
    norm_sat.push({ name, t, exp })
    Ctx.update(ctx, name, entry.t, entry.value)
  }
  const norm_scope = new Array()
  if (next !== undefined) {
    const name = next.name
    const t = Value.readback(mod, ctx, Value.type, next.t)
    norm_scope.push({ name, t })
    Ctx.update(ctx, name, next.t)
    Env.update(env, name, Value.not_yet(next.t, Neutral.v(name)))
  }
  // NOTE the `tel.mod` is used in the following, instead of `mod`
  for (const entry of scope) {
    const name = entry.name
    const t_value = Exp.evaluate(tel.mod, env, entry.t)
    const t = Value.readback(tel.mod, ctx, Value.type, t_value)
    norm_scope.push({ name, t })
    Ctx.update(ctx, name, t_value)
    Env.update(env, name, Value.not_yet(t_value, Neutral.v(name)))
  }
  return Exp.cls(norm_sat, norm_scope)
}

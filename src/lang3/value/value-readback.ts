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
import { readback_obj } from "./value-readback-obj"

export function readback(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  t: Value.Value,
  value: Value.Value
): Exp.Exp {
  if (t.kind === "Value.union") return readback_union(mod, ctx, t, value)
  if (t.kind === "Value.pi") {
    // NOTE everything with a function type
    //   is immediately read back as having a Lambda on top.
    //   This implements the η-rule for functions.
    const fresh_name = ut.freshen_name(
      new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
      t.ret_t_cl.name
    )
    const variable = Value.not_yet(t.arg_t, Neutral.v(fresh_name))
    return Exp.fn(
      fresh_name,
      Value.readback(
        mod,
        Ctx.extend(ctx, fresh_name, t.arg_t),
        Closure.apply(t.ret_t_cl, variable),
        Exp.do_ap(value, variable)
      )
    )
  }
  if (t.kind === "Value.cls") return readback_obj(mod, ctx, t, value)
  if (
    t.kind === "Value.absurd" &&
    value.kind === "Value.not_yet" &&
    value.t.kind === "Value.absurd"
  )
    return Exp.the(Exp.absurd, Neutral.readback(mod, ctx, value.neutral))
  if (t.kind === "Value.equal" && value.kind === "Value.same")
    return Exp.same
  if (t.kind === "Value.str" && value.kind === "Value.quote")
    return Exp.quote(value.str)
  if (t.kind === "Value.type" && value.kind === "Value.str")
    return Exp.str
  if (t.kind === "Value.type" && value.kind === "Value.quote")
    return Exp.quote(value.str)
  if (t.kind === "Value.quote" && value.kind === "Value.quote")
    return Exp.quote(value.str)
  if (t.kind === "Value.type" && value.kind === "Value.absurd")
    return Exp.absurd
  if (t.kind === "Value.type" && value.kind === "Value.equal")
    return Exp.equal(
      Value.readback(mod, ctx, Value.type, value.t),
      Value.readback(mod, ctx, value.t, value.from),
      Value.readback(mod, ctx, value.t, value.to)
    )
  if (t.kind === "Value.type" && value.kind === "Value.cls") {
    const { sat, tel } = value
    const { next, scope } = tel
    let { env } = value.tel
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
  if (t.kind === "Value.type" && value.kind === "Value.pi") {
    const fresh_name = ut.freshen_name(
      new Set([...Mod.names(mod), ...Ctx.names(ctx)]),
      value.ret_t_cl.name
    )
    const variable = Value.not_yet(value.arg_t, Neutral.v(fresh_name))
    const arg_t = Value.readback(mod, ctx, Value.type, value.arg_t)
    const ret_t = Value.readback(
      mod,
      Ctx.extend(ctx, fresh_name, value.arg_t),
      Value.type,
      Closure.apply(value.ret_t_cl, variable)
    )
    return Exp.pi(fresh_name, arg_t, ret_t)
  }
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
  throw new Trace.Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}

import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"

export function infer_cls(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  cls: Exp.cls
): Value.type {
  // NOTE We DO need to update the `ctx` as we go along.
  // - just like inferring `Exp.sigma`.
  ctx = Ctx.clone(ctx)
  go_through_sat(mod, ctx, cls.sat)
  return infer_scope(mod, ctx, cls.scope)
}

function go_through_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  sat: Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }>
): void {
  for (const entry of sat) {
    Exp.check(mod, ctx, entry.t, Value.type)
    const t = Exp.evaluate(mod, Ctx.to_env(ctx), entry.t)
    Exp.check(mod, ctx, entry.exp, t)
    Ctx.update(ctx, entry.name, t)
  }
}

function infer_scope(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  scope: Array<{ name: string; t: Exp.Exp }>
): Value.type {
  if (scope.length === 0) return Value.type

  const [entry, ...tail] = scope
  Exp.check(mod, ctx, entry.t, Value.type)
  const t = Exp.evaluate(mod, Ctx.to_env(ctx), entry.t)
  Ctx.update(ctx, entry.name, t)
  return infer_scope(mod, ctx, tail)
}

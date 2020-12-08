import { evaluator } from "../evaluator"
import * as Infer from "../infer"
import * as Check from "../check"
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
  go_through_scope(mod, ctx, cls.scope)
  return Value.type
}

function go_through_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  sat: Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }>
): void {
  for (const entry of sat) {
    Check.check(mod, ctx, entry.t, Value.type)
    const t = evaluator.evaluate(entry.t, {mod, env: Ctx.to_env(ctx)})
    Check.check(mod, ctx, entry.exp, t)
    Ctx.update(ctx, entry.name, t)
  }
}

function go_through_scope(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  scope: Array<{ name: string; t: Exp.Exp }>
): void {
  if (scope.length === 0) return
  const [entry, ...tail] = scope
  Check.check(mod, ctx, entry.t, Value.type)
  const t = evaluator.evaluate(entry.t, {mod, env: Ctx.to_env(ctx)})
  Ctx.update(ctx, entry.name, t)
  go_through_scope(mod, ctx, tail)
}

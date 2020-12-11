import { Inferable } from "../../inferable"
import { evaluator } from "../../evaluator"
import * as Infer from "../../infer"
import * as Check from "../../check"
import * as Exp from "../../exp"
import * as Value from "../../value"
import * as Ctx from "../../ctx"
import * as Mod from "../../mod"

export function cls_inferable(
  sat: Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }>,
  scope: Array<{ name: string; t: Exp.Exp }>
): Inferable {
  return Inferable({
    inferability: ({ mod, ctx }) => {
      // NOTE We DO need to update the `ctx` as we go along.
      // - just like inferring `Exp.sigma`.
      const new_ctx = Ctx.clone(ctx)
      go_through_sat(mod, new_ctx, sat)
      go_through_scope(mod, new_ctx, scope)
      return Value.type
    }
  })
}

function go_through_sat(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  sat: Array<{ name: string; t: Exp.Exp; exp: Exp.Exp }>
): void {
  for (const entry of sat) {
    Check.check(mod, ctx, entry.t, Value.type)
    const t = evaluator.evaluate(entry.t, { mod, env: Ctx.to_env(ctx) })
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
  const t = evaluator.evaluate(entry.t, { mod, env: Ctx.to_env(ctx) })
  Ctx.update(ctx, entry.name, t)
  go_through_scope(mod, ctx, tail)
}

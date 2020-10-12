import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"

export function infer_cls(ctx: Ctx.Ctx, cls: Exp.cls): Value.Value {
  // NOTE We DO need to update the `ctx` as we go along.
  // - just like inferring `Exp.sigma`.
  ctx = Ctx.clone(ctx)
  for (const entry of cls.sat) {
    Exp.check(ctx, entry.t, Value.type)
    const t = Exp.evaluate(Ctx.to_env(ctx), entry.t)
    Exp.check(ctx, entry.exp, t)
    Ctx.update(ctx, entry.name, t)
  }

  if (cls.scope.length === 0) return Value.type

  const [entry, ...tail] = cls.scope
  Exp.check(ctx, entry.t, Value.type)
  const t = Exp.evaluate(Ctx.to_env(ctx), entry.t)
  Ctx.update(ctx, entry.name, t)
  return Exp.infer(ctx, Exp.cls([], tail))
}

import * as Exp from "../exp"
import * as Value from "../value"
import * as Telescope from "../telescope"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_obj(ctx: Ctx.Ctx, obj: Exp.obj, cls: Value.cls): void {
  // NOTE We DO NOT need to update the `ctx` as we go along.
  // - just like checking `Exp.cons`.
  const properties = new Map(obj.properties)
  aganst_sat(ctx, properties, cls.sat)
  if (cls.tel.next === undefined) return
  const next_value = aganst_next(ctx, properties, cls.tel.next)
  const filled_tel = Telescope.fill(cls.tel, next_value)
  Exp.check(ctx, Exp.obj(properties), Value.cls([], filled_tel))
}

function aganst_sat(
  ctx: Ctx.Ctx,
  properties: Map<string, Exp.Exp>,
  sat: Array<{ name: string; t: Value.Value; value: Value.Value }>
): void {
  for (const entry of sat) {
    const found = properties.get(entry.name)
    if (found === undefined) {
      throw new Trace.Trace(
        ut.aline(`
          |Can not found satisfied entry name: ${entry.name}
          |`)
      )
    }
    Exp.check(ctx, found, entry.t)
    const value = Exp.evaluate(Ctx.to_env(ctx), found)
    if (!Value.conversion(ctx, entry.t, value, entry.value)) {
      throw new Trace.Trace(
        ut.aline(`
          |I am expecting the following two values to be the same ${Exp.repr(
            Value.readback(ctx, Value.type, entry.t)
          )}.
          |But they are not.
          |The value in object:
          |  ${Exp.repr(Value.readback(ctx, entry.t, value))}
          |The value in partially filled class:
          |  ${Exp.repr(Value.readback(ctx, entry.t, entry.value))}
          |`)
      )
    }
    properties.delete(entry.name)
  }
}

function aganst_next(
  ctx: Ctx.Ctx,
  properties: Map<string, Exp.Exp>,
  next: { name: string; t: Value.Value }
): Value.Value {
  const found = properties.get(next.name)
  if (found === undefined) {
    throw new Trace.Trace(
      ut.aline(`
        |Can not found next name: ${next.name}
        |`)
    )
  }
  Exp.check(ctx, found, next.t)
  properties.delete(next.name)
  return Exp.evaluate(Ctx.to_env(ctx), found)
}

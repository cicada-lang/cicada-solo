import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_same(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  same: Exp.same,
  equal: Value.equal
): void {
  if (!Value.conversion(mod, ctx, equal.t, equal.from, equal.to)) {
    throw new Trace.Trace(
      ut.aline(`
          |I am expecting the following two values to be the same ${Exp.repr(
            Value.readback(mod, ctx, Value.type, equal.t)
          )}.
          |But they are not.
          |from:
          |  ${Exp.repr(Value.readback(mod, ctx, equal.t, equal.from))}
          |to:
          |  ${Exp.repr(Value.readback(mod, ctx, equal.t, equal.to))}
          |`)
    )
  }
}

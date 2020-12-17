import * as Readback from "../readback"
import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_union(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  union: Value.union,
  value: Value.Value
): Exp.Exp {
  try {
    return Readback.readback(mod, ctx, union.left, value)
  } catch (left_error) {
    if (left_error instanceof Trace.Trace) {
      try {
        return Readback.readback(mod, ctx, union.right, value)
      } catch (right_error) {
        if (right_error instanceof Trace.Trace) {
          throw new Trace.Trace(
            ut.aline(`
              |I can not readback value: ${ut.inspect(value.kind)}
              |union type left: ${ut.inspect(union.left.kind)}
              |union type right: ${ut.inspect(union.right.kind)}
              |left_error: ${ut.indent(left_error.message)}
              |right_error: ${ut.indent(right_error.message)}
              |`)
          )
        } else {
          throw right_error
        }
      }
    } else {
      throw left_error
    }
  }
}

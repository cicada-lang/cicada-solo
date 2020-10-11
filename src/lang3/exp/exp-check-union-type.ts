import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"
import { check_by_infer } from "./exp-check-by-infer"

export function check_union_type(
  ctx: Ctx.Ctx,
  exp: Exp.Exp,
  union: Value.union
): void {
  const { left, right } = union
  try {
    check_by_infer(ctx, exp, union)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      try {
        Exp.check(ctx, exp, left)
      } catch (error_left) {
        if (error_left instanceof Trace.Trace) {
          try {
            Exp.check(ctx, exp, right)
          } catch (error_right) {
            if (error_right instanceof Trace.Trace) {
              throw new Trace.Trace(
                ut.aline(`
              |Check of both part of union type failed.
              |
              |left: ${ut.indent(error_left.message, "  ")}
              |right: ${ut.indent(error_right.message, "  ")}`)
              )
            } else {
              throw error_right
            }
          }
        } else {
          throw error_left
        }
      }
    } else {
      throw error
    }
  }
}

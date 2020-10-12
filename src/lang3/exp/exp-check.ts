import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import { check_union_type } from "./exp-check-union-type"
import { check_fn } from "./exp-check-fn"
import { check_obj } from "./exp-check-obj"
import { check_same } from "./exp-check-same"
import { check_quote } from "./exp-check-quote"
import { check_begin } from "./exp-check-begin"
import { check_by_infer } from "./exp-check-by-infer"

export function check(ctx: Ctx.Ctx, exp: Exp.Exp, t: Value.Value): void {
  try {
    if (t.kind === "Value.union") return check_union_type(ctx, exp, t)
    if (exp.kind === "Exp.fn") return check_fn(ctx, exp, Value.is_pi(ctx, t))
    if (exp.kind === "Exp.obj") return check_obj(ctx, exp, Value.is_cls(ctx, t))
    if (exp.kind === "Exp.same")
      return check_same(ctx, exp, Value.is_equal(ctx, t))
    if (exp.kind === "Exp.begin") return check_begin(ctx, exp, t)
    if (exp.kind === "Exp.quote") return check_quote(ctx, exp, t)
    return check_by_infer(ctx, exp, t)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    } else {
      throw error
    }
  }
}

import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import { check_union_type } from "./check-union-type"
import { check_case_fn } from "./check-case-fn"
import { check_obj } from "./check-obj"
import { check_by_infer } from "./check-by-infer"

export function check(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  exp: Exp.Exp,
  t: Value.Value
): void {
  try {
    if (t.kind === "Value.union") return check_union_type(mod, ctx, exp, t)
    if (exp.kind === "Exp.fn") return exp.checkability(t, { mod, ctx })
    if (exp.kind === "Exp.case_fn")
      return check_case_fn(mod, ctx, exp, Value.is_pi(mod, ctx, t))
    if (exp.kind === "Exp.obj")
      return check_obj(mod, ctx, exp, Value.is_cls(mod, ctx, t))
    if (exp.kind === "Exp.same") return exp.checkability(t, { mod, ctx })
    if (exp.kind === "Exp.quote") return exp.checkability(t, { mod, ctx })
    if (exp.kind === "Exp.begin") return exp.checkability(t, { mod, ctx })
    return check_by_infer(mod, ctx, exp, t)
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}

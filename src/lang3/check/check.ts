import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import { check_union_type } from "./check-union-type"

// NOTE MAYBE use `Checker` and singleton `checker`

export function check(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  exp: Exp.Exp,
  t: Value.Value
): void {
  try {
    if (t.kind === "Value.union") return check_union_type(mod, ctx, exp, t)
    return exp.checkability(t, { mod, ctx })
  } catch (error) {
    if (error instanceof Trace.Trace) {
      throw Trace.trail(error, exp)
    }
    throw error
  }
}

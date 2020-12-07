import * as Readback from "../readback"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Pattern from "../pattern"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as ut from "../../ut"

export function readback_case_fn(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  pi: Value.pi,
  case_fn: Value.case_fn
): Exp.case_fn {
  return Exp.case_fn(
    case_fn.ret_cl
      .map((ret_cl) => Readback.readback(mod, ctx, pi, Value.fn(ret_cl)))
      .map((exp) => {
        const fn = exp as Exp.fn
        return {
          pattern: fn.pattern,
          ret: fn.ret,
        }
      })
  )
}

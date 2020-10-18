import * as Exp from "../exp"
import * as Value from "../value"
import * as Pattern from "../pattern"
import * as Neutral from "../neutral"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_case_fn(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  case_fn: Exp.case_fn,
  pi: Value.pi
): void {
  for (const { pattern, ret } of case_fn.cases) {
    Exp.check(mod, ctx, Exp.fn(pattern, ret), pi)
  }
}

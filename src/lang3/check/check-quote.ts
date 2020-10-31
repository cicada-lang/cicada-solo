import * as Check from "../check"
import * as Evaluate from "../evaluate"
import * as Exp from "../exp"
import * as Value from "../value"
import * as Ctx from "../ctx"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_quote(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  quote: Exp.quote,
  t: Value.Value
): void {
  if (t.kind === "Value.type" || t.kind === "Value.str") return
  if (t.kind === "Value.quote" && quote.str === t.str) return
  throw new Trace.Trace(
    ut.aline(`
      |The given value is string: ${Exp.repr(quote)},
      |But the given type is ${Exp.repr(
        Value.readback(mod, ctx, Value.type, t)
      )}.
      |`)
  )
}

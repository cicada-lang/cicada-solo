import * as Value from "../value"
import * as Closure from "../closure"
import * as Neutral from "../neutral"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as Env from "../env"
import * as Mod from "../mod"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function readback_quote(
  mod: Mod.Mod,
  ctx: Ctx.Ctx,
  quote: Value.quote,
  value: Value.Value
): Exp.Exp {
  if (value.kind === "Value.quote" && value.str === quote.str)
    return Exp.quote(value.str)

  throw new Trace.Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(quote)}.
      |`)
  )
}

import * as Exp from "../exp"
import * as Stmt from "../stmt"
import * as Value from "../value"
import * as Neutral from "../neutral"
import * as Closure from "../closure"
import * as Telescope from "../telescope"
import * as Ctx from "../ctx"
import * as Trace from "../../trace"
import * as ut from "../../ut"

export function check_quote(ctx: Ctx.Ctx, quote: Exp.quote, t: Value.Value): void {
  if (t.kind === "Value.type") {
    // NOTE literal string type
    return
  } else if (t.kind === "Value.str") {
    return
  } else if (t.kind === "Value.quote") {
    if (quote.str === t.str) {
      return
    } else {
      throw new Trace.Trace(
        ut.aline(`
          |The given value is string: ${Exp.repr(quote)},
          |But the given type is ${Exp.repr(
            Value.readback(ctx, Value.type, t)
          )}.
          |`)
      )
    }
  } else {
    throw new Trace.Trace(
      ut.aline(`
        |The given value is string: ${Exp.repr(quote)},
        |But the given type is ${Exp.repr(
          Value.readback(ctx, Value.type, t)
        )}.
        |`)
    )
  }
}

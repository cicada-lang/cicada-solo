import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as ut from "../../ut"
import * as Readback from "../readback"

export function unexpected(
  ctx: Ctx.Ctx,
  value: Value.Value,
  opts: { message?: string } = {}
): string {
  const exp_repr = Exp.repr(Readback.readback(ctx, Value.type, value))
  if (opts.message !== undefined) {
    return ut.aline(`
        |I see unexpected ${exp_repr}.
        |${opts.message}
        |`)
  } else {
    return ut.aline(`
        |I see unexpected ${exp_repr}.
        |`)
  }
}

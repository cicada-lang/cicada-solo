import * as Value from "../value"
import * as Exp from "../exp"
import * as Ctx from "../ctx"
import * as ut from "../ut"
import * as Readback from "../readback"
import { TypeValue } from "../core"

export function unexpected(
  ctx: Ctx.Ctx,
  value: Value.Value,
  opts: { message?: string } = {}
): string {
  const exp_repr = Readback.readback(ctx, new TypeValue(), value).repr()
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

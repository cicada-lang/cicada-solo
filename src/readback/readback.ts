import { Value } from "../value"
import { Exp } from "../exp"
import { Ctx } from "../ctx"
import { Absurd } from "../core"
import { The } from "../core"
import { AbsurdValue } from "../core"
import { NotYetValue } from "../core"
import { Trace } from "../trace"
import * as ut from "../ut"

export function readback(ctx: Ctx, t: Value, value: Value): Exp {
  if (t.eta_expand) {
    return t.eta_expand(ctx, value)
  }

  if (
    t instanceof AbsurdValue &&
    value instanceof NotYetValue &&
    value.t instanceof AbsurdValue
  ) {
    return new The(new Absurd(), value.neutral.readback_neutral(ctx))
  }

  const exp = value.readback(ctx, t)

  if (exp !== undefined) {
    return exp
  }

  throw new Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}

import { Value } from "../value"
import { Core } from "../core"
import { Ctx } from "../ctx"
import { Trace } from "../trace"
import * as ut from "../ut"
import * as Cores from "../cores"

export function readback(ctx: Ctx, t: Value, value: Value): Core {
  if (t.eta_expand) {
    return t.eta_expand(ctx, value)
  }

  if (
    t instanceof Cores.AbsurdValue &&
    value instanceof Cores.NotYetValue &&
    value.t instanceof Cores.AbsurdValue
  ) {
    return new Cores.The(
      new Cores.Absurd(),
      value.neutral.readback_neutral(ctx)
    )
  }

  const exp = value.readback(ctx, t)

  if (exp) return exp

  console.log(value)
  console.log(t)
  throw new Trace(
    ut.aline(`
      |I can not readback value: ${ut.inspect(value)},
      |of type: ${ut.inspect(t)}.
      |`)
  )
}

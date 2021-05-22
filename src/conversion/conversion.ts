import { Core, AlphaCtx } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { readback } from "../readback"
import { Trace } from "../trace"
import * as Cores from "../cores"
import * as ut from "../ut"

export function conversion(ctx: Ctx, t: Value, x: Value, y: Value): boolean {
  return alpha_equivalent(readback(ctx, t, x), readback(ctx, t, y))
}

function alpha_equivalent(x: Core, y: Core): boolean {
  return x.alpha_repr(new AlphaCtx()) === y.alpha_repr(new AlphaCtx())
}

export function check_conversion(
  ctx: Ctx,
  t: Value,
  from: Value,
  to: Value,
  opts: {
    description?: {
      from: string
      to: string
    }
  }
): void {
  if (!conversion(ctx, t, from, to)) {
    const t_repr = readback(ctx, new Cores.TypeValue(), t).repr()
    const from_repr = readback(ctx, t, from).repr()
    const from_description = opts.description?.from || ""
    const to_repr = readback(ctx, t, to).repr()
    const to_description = opts.description?.to || ""
    throw new Trace(
      ut.aline(`
        |I am expecting the following two values to be the same ${t_repr}.
        |But they are not.
        |from ${from_description}:
        |  ${from_repr}
        |to ${from_description}:
        |  ${to_repr}
        |`)
    )
  }
}

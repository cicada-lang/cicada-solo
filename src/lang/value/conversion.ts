import { Core, AlphaCtx } from "../core"
import { Value } from "../value"
import { Ctx } from "../ctx"
import { readback } from "../value"
import { ExpTrace } from "../errors"
import * as Exps from "../exps"
import * as ut from "../../ut"

export function conversion(ctx: Ctx, t: Value, x: Value, y: Value): boolean {
  return alpha_equivalent(ctx, readback(ctx, t, x), readback(ctx, t, y))
}

function alpha_equivalent(ctx: Ctx, x: Core, y: Core): boolean {
  const names = ctx.names
  const alpha_ctx = new AlphaCtx()
  const x_repr = x.alpha_repr(alpha_ctx)
  const y_repr = y.alpha_repr(alpha_ctx)
  return x_repr === y_repr
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
    const t_repr = readback(ctx, new Exps.TypeValue(), t).repr()
    const from_repr = readback(ctx, t, from).repr()
    const from_description = opts.description?.from || ""
    const to_repr = readback(ctx, t, to).repr()
    const to_description = opts.description?.to || ""
    throw new ExpTrace(
      [
        `I am expecting the following two values to be the same ${t_repr}.`,
        `But they are not.`,
        ``,
        `from ${from_description}:`,
        `  ${from_repr}`,
        `to ${to_description}:`,
        `  ${to_repr}`,
      ].join("\n")
    )
  }
}

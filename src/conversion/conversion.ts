import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { readback } from "@/readback"

export function conversion(ctx: Ctx, t: Value, x: Value, y: Value): boolean {
  return alpha_equivalent(readback(ctx, t, x), readback(ctx, t, y))
}

function alpha_equivalent(x: Exp, y: Exp): boolean {
  return x.alpha_repr(new AlphaCtx()) === y.alpha_repr(new AlphaCtx())
}

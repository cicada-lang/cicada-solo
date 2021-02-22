import { Exp, AlphaCtx } from "../exp"

export function equivalent(x: Exp, y: Exp): boolean {
  const ctx = new AlphaCtx()
  return x.alpha_repr(ctx) === y.alpha_repr(ctx)
}

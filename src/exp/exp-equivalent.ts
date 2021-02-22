import { Exp, AlphaCtx } from "../exp"

export function equivalent(x: Exp, y: Exp): boolean {
  return x.alpha_repr(new AlphaCtx()) === y.alpha_repr(new AlphaCtx())
}

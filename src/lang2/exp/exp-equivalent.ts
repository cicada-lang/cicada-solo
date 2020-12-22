import { Exp } from "../exp"

export function equivalent(x: Exp, y: Exp): boolean {
  const ctx = { depth: 0, depths: new Map() }
  return x.alpha_repr(ctx) === y.alpha_repr(ctx)
}

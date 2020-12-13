import * as Exp from "../exp"

export function equivalent(x: Exp.Exp, y: Exp.Exp): boolean {
  const ctx = { depth: 0, depths: new Map() }
  return x.alpha_repr(ctx) === y.alpha_repr(ctx)
}

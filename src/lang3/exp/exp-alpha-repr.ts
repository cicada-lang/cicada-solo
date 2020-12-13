import * as Exp from "../exp"

type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export function alpha_repr(exp: Exp.Exp, opts: AlphaReprOpts): string {
  return exp.alpha_repr(opts)
}

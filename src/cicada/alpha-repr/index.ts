export type AlphaReprOpts = {
  depth: number
  depths: Map<string, number>
}

export type AlphaRepr = {
  alpha_repr(opts: AlphaReprOpts): string
}

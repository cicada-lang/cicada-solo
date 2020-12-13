export type AlphaPrintCtx = {
  depth: number
  depths: Map<string, number>
}

export type AlphaPrint = {
  alpha_print(ctx: AlphaPrintCtx): string
}

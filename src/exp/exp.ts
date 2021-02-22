import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export type Exp = {
  kind: string
  evaluate(env: Env): Value
  check?(ctx: Ctx, t: Value): void
  infer?(ctx: Ctx): Value
  repr(): string
  alpha_repr(opts: AlphaCtx): string
}

export class AlphaCtx {
  depth: number
  depths: Map<string, number>

  constructor(depth: number = 0, depths: Map<string, number> = new Map()) {
    this.depth = depth
    this.depths = depths
  }
}

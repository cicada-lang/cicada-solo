import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export abstract class Core {
  instanceofCore = true

  abstract evaluate(env: Env): Value
  abstract repr(): string
  abstract alpha_repr(ctx: AlphaCtx): string
}

export class AlphaCtx {
  depths: Array<[string, number]>

  constructor(depths: Array<[string, number]> = new Array()) {
    this.depths = depths
  }

  get depth(): number {
    return this.depths.length
  }

  lookup_depth(name: string): number | undefined {
    console.log(this.depths)
    let index: undefined | number = undefined

    for (const [n, i] of this.depths) {
      if (name === n) {
        index = i
      }
    }

    return index
  }

  extend(name: string): AlphaCtx {
    return new AlphaCtx([...this.depths, [name, this.depth]])
  }
}

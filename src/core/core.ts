import { Env } from "../env"
import { Ctx } from "../ctx"
import { Value } from "../value"

export abstract class Core {
  __the_abstract_class_name_is_core__ = "Core"

  abstract evaluate(env: Env): Value
  abstract repr(): string
  abstract alpha_repr(ctx: AlphaCtx): string
}

export class AlphaCtx {
  depth: number
  depths: Map<string, number>

  constructor(depth: number = 0, depths: Map<string, number> = new Map()) {
    this.depth = depth
    this.depths = depths
  }

  extend(name: string): AlphaCtx {
    return new AlphaCtx(
      this.depth + 1,
      new Map([...this.depths, [name, this.depth]])
    )
  }
}

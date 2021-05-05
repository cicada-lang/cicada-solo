import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vector extends Core {
  elem_t: Core
  length: Core

  constructor(elem_t: Core, length: Core) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  evaluate(env: Env): Value {
    return new Cores.VectorValue(
      evaluate(env, this.elem_t),
      evaluate(env, this.length)
    )
  }

  repr(): string {
    return `Vector(${this.elem_t.repr()}, ${this.length.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `Vector(${this.elem_t.alpha_repr(ctx)}, ${this.length.alpha_repr(
      ctx
    )})`
  }
}

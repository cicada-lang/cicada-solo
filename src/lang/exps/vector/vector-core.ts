import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class VectorCore extends Core {
  elem_t: Core
  length: Core

  constructor(elem_t: Core, length: Core) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  evaluate(env: Env): Value {
    return new Exps.VectorValue(
      evaluate(env, this.elem_t),
      evaluate(env, this.length)
    )
  }

  format(): string {
    return `Vector(${this.elem_t.format()}, ${this.length.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `Vector(${this.elem_t.alpha_format(ctx)}, ${this.length.alpha_format(
      ctx
    )})`
  }
}

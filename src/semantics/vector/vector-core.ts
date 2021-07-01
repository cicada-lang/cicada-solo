import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class VectorCore extends Core {
  elem_t: Core
  length: Core

  constructor(elem_t: Core, length: Core) {
    super()
    this.elem_t = elem_t
    this.length = length
  }

  evaluate(env: Env): Value {
    return new Sem.VectorValue(
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

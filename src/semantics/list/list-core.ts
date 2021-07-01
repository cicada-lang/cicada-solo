import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class ListCore extends Core {
  elem_t: Core

  constructor(elem_t: Core) {
    super()
    this.elem_t = elem_t
  }

  evaluate(env: Env): Value {
    return new Sem.ListValue(evaluate(env, this.elem_t))
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `List(${this.elem_t.alpha_repr(ctx)})`
  }
}

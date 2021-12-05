import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ListCore extends Core {
  elem_t: Core

  constructor(elem_t: Core) {
    super()
    this.elem_t = elem_t
  }

  evaluate(env: Env): Value {
    return new Exps.ListValue(evaluate(env, this.elem_t))
  }

  format(): string {
    return `List(${this.elem_t.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `List(${this.elem_t.alpha_format(ctx)})`
  }
}

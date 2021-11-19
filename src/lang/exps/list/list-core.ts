import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

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

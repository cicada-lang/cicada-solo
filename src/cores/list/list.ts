import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { ListValue } from "../../cores"

export class List extends Core {
  elem_t: Core

  constructor(elem_t: Core) {
    super()
    this.elem_t = elem_t
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ListValue(evaluate(ctx, env, this.elem_t))
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `List(${this.elem_t.alpha_repr(ctx)})`
  }
}

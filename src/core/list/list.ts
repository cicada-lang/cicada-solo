import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import { TypeValue } from "../../core"
import { ListValue } from "../../core"

export class List implements Exp {
  elem_t: Exp

  constructor(elem_t: Exp) {
    this.elem_t = elem_t
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new ListValue(evaluate(ctx, env, this.elem_t))
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.elem_t, new TypeValue())
    return new TypeValue()
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `List(${this.elem_t.alpha_repr(ctx)})`
  }
}

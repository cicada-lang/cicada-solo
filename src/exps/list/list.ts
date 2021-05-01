import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { check } from "../../check"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class List extends Exp {
  elem_t: Exp

  constructor(elem_t: Exp) {
    super()
    this.elem_t = elem_t
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.ListValue(evaluate(ctx, env, this.elem_t))
  }

  infer(ctx: Ctx): Value {
    check(ctx, this.elem_t, new Cores.TypeValue())
    return new Cores.TypeValue()
  }

  repr(): string {
    return `List(${this.elem_t.repr()})`
  }
}

import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TypeValue } from "../../core"
import { ListValue } from "../../core"

export class List implements Exp {
  elem_t: Exp

  constructor(elem_t: Exp) {
    this.elem_t = elem_t
  }

  evaluate(env: Env): Value {
    throw new Error("TODO")
  }

  infer(ctx: Ctx): Value {
    throw new Error("TODO")
  }

  repr(): string {
    throw new Error("TODO")
  }

  alpha_repr(ctx: AlphaCtx): string {
    throw new Error("TODO")
  }
}

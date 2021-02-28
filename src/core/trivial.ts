import { Exp, AlphaCtx } from "@/exp"
import { Value } from "@/value"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { TypeValue } from "@/core"
import { TrivialValue } from "@/core"

export class Trivial implements Exp {
  evaluate(env: Env): Value {
    return new TrivialValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Trivial"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Trivial"
  }
}

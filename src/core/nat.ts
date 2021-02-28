import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { Value } from "../value"
import { TypeValue } from "../core"
import { NatValue } from "../core"

export class Nat implements Exp {
  evaluate(env: Env): Value {
    return new NatValue()
  }

  infer(ctx: Ctx): Value {
    return new TypeValue()
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Nat"
  }
}

import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { TypeValue } from "../../cores"
import { NatValue } from "../../cores"

export class Nat implements Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new NatValue()
  }

  repr(): string {
    return "Nat"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Nat"
  }
}

import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import { ListValue, NilValue } from "../../cores"

export class Nil extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new NilValue()
  }

  check(ctx: Ctx, t: Value): void {
    expect(ctx, t, ListValue)
  }

  repr(): string {
    return "nil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "nil"
  }
}

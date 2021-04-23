import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import { ListValue, NilValue } from "../../core"

export class Nil implements Exp {
  evaluate(env: Env): Value {
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

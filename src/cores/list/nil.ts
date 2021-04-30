import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import { ListValue, NilValue } from "../../cores"

export class Nil implements Core {
  evaluate(ctx: Ctx, env: Env): Value {
    return new NilValue()
  }

  repr(): string {
    return "nil"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "nil"
  }
}

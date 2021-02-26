import { Env } from "../env"
import { Ctx } from "../ctx"
import { Exp, AlphaCtx } from "../exp"
import { TypeValue } from "../core"
import { AbsurdValue } from "../core"
import * as Value from "../value"

export class Absurd implements Exp {
  evaluate(env: Env): Value.Value {
    return new AbsurdValue()
  }

  infer(ctx: Ctx): Value.Value {
    return new TypeValue()
  }

  repr(): string {
    return "Absurd"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "Absurd"
  }
}

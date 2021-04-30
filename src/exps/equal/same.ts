import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { expect } from "../../expect"
import { readback } from "../../readback"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import { TypeValue } from "../../cores"
import { EqualValue, SameValue } from "../../cores"

export class Same implements Exp {
  check(ctx: Ctx, t: Value): void {
    const equal = expect(ctx, t, EqualValue)
    if (!conversion(ctx, equal.t, equal.from, equal.to)) {
      throw new Trace(
        ut.aline(`
          |I am expecting the following two values to be the same type:
          |  ${readback(ctx, new TypeValue(), equal.t).repr()}
          |But they are not.
          |from:
          |  ${readback(ctx, equal.t, equal.from).repr()}
          |to:
          |  ${readback(ctx, equal.t, equal.to).repr()}
          |`)
      )
    }
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return new SameValue()
  }

  repr(): string {
    return "same"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "same"
  }
}

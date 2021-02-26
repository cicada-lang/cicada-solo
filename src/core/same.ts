import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import * as Value from "../value"
import { readback } from "../readback"
import * as Trace from "../trace"
import * as ut from "../ut"
import { TypeValue } from "../core"
import { SameValue } from "../core"

export class Same implements Exp {
  check(ctx: Ctx, t: Value.Value): void {
    const equal = Value.is_equal(ctx, t)
    if (!Value.conversion(ctx, equal.t, equal.from, equal.to)) {
      throw new Trace.Trace(
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

  evaluate(env: Env): Value.Value {
    return new SameValue()
  }

  repr(): string {
    return "same"
  }

  alpha_repr(ctx: AlphaCtx): string {
    return "same"
  }
}

import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value } from "../../value"
import { expect } from "../../expect"
import { readback } from "../../readback"
import { conversion } from "../../conversion"
import { Trace } from "../../trace"
import * as ut from "../../ut"
import * as Cores from "../../cores"

export class Same extends Exp {
  evaluate(env: Env): Value {
    return new Cores.SameValue()
  }

  check(ctx: Ctx, t: Value): void {
    const equal = expect(ctx, t, Cores.EqualValue)
    if (!conversion(ctx, equal.t, equal.from, equal.to)) {
      throw new Trace(
        ut.aline(`
          |I am expecting the following two values to be the same type:
          |  ${readback(ctx, new Cores.TypeValue(), equal.t).repr()}
          |But they are not.
          |from:
          |  ${readback(ctx, equal.t, equal.from).repr()}
          |to:
          |  ${readback(ctx, equal.t, equal.to).repr()}
          |`)
      )
    }
  }

  repr(): string {
    return "same"
  }
}

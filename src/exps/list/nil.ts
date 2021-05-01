import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Nil extends Exp {
  evaluate(ctx: Ctx, env: Env): Value {
    return new Cores.NilValue()
  }

  check(ctx: Ctx, t: Value): void {
    expect(ctx, t, Cores.ListValue)
  }

  repr(): string {
    return "nil"
  }
}

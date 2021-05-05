import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vecnil extends Exp {
  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Cores.VectorValue)
    expect(ctx, vector_t.length, Cores.Zero)
    return new Cores.Vecnil()
  }

  repr(): string {
    return "vecnil"
  }
}

import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Vecnil extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Cores.VectorValue)
    expect(ctx, vector_t.length, Cores.ZeroValue)
    return new Cores.Vecnil()
  }

  repr(): string {
    return "vecnil"
  }
}

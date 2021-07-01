import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../value"
import { Value } from "../../value"
import * as Sem from "../../sem"

export class Vecnil extends Exp {
  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Sem.VectorValue)
    expect(ctx, vector_t.length, Sem.ZeroValue)
    return new Sem.VecnilCore()
  }

  repr(): string {
    return "vecnil"
  }
}

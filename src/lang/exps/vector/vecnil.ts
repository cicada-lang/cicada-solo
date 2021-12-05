import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

export class Vecnil extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): this {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    const vector_t = expect(ctx, t, Exps.VectorValue)
    expect(ctx, vector_t.length, Exps.ZeroValue)
    return new Exps.VecnilCore()
  }

  format(): string {
    return "vecnil"
  }
}

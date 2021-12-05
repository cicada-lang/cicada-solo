import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Exp, ExpMeta } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

export class Nil extends Exp {
  meta: ExpMeta

  constructor(meta: ExpMeta) {
    super()
    this.meta = meta
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set()
  }

  subst(name: string, exp: Exp): Exp {
    return this
  }

  check(ctx: Ctx, t: Value): Core {
    expect(ctx, t, Exps.ListValue)
    return new Exps.NilCore()
  }

  format(): string {
    return "nil"
  }
}

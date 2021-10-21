import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { expect } from "../../value"
import { Value } from "../../value"
import { Solution } from "../../solution"
import * as Exps from "../../exps"

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

  repr(): string {
    return "nil"
  }
}

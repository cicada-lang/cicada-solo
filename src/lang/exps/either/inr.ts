import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { expect } from "../../value"
import * as Exps from "../../exps"

export class Inr extends Exp {
  meta: ExpMeta
  right: Exp

  constructor(right: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.right = right
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.right.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Inr(subst(this.right, name, exp), this.meta)
  }

  check(ctx: Ctx, t: Value): Core {
    const either = expect(ctx, t, Exps.EitherValue)
    const right_core = check(ctx, this.right, either.right_t)

    return new Exps.InrCore(right_core)
  }

  repr(): string {
    const args = [this.right.repr()].join(", ")

    return `inr(${args})`
  }
}

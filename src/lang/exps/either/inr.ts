import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { check, Exp, ExpMeta, subst } from "../../exp"
import * as Exps from "../../exps"
import { expect, Value } from "../../value"

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

  format(): string {
    const args = [this.right.format()].join(", ")

    return `inr(${args})`
  }
}

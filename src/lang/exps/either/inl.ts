import { Exp, ExpMeta, subst } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { check } from "../../exp"
import { expect } from "../../value"
import * as Exps from "../../exps"

export class Inl extends Exp {
  meta: ExpMeta
  left: Exp

  constructor(left: Exp, meta: ExpMeta) {
    super()
    this.meta = meta
    this.left = left
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.left.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Inl(subst(this.left, name, exp), this.meta)
  }

  check(ctx: Ctx, t: Value): Core {
    const either = expect(ctx, t, Exps.EitherValue)
    const left_core = check(ctx, this.left, either.left_t)

    return new Exps.InlCore(left_core)
  }

  format(): string {
    const args = [this.left.format()].join(", ")

    return `inl(${args})`
  }
}

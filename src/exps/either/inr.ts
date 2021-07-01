import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../exp"
import { expect } from "../../value"
import * as Exps from "../../exps"

export class Inr extends Exp {
  right: Exp

  constructor(right: Exp) {
    super()
    this.right = right
  }

  free_names(bound_names: Set<string>): Set<string> {
    return new Set([...this.right.free_names(bound_names)])
  }

  subst(name: string, exp: Exp): Exp {
    return new Inr(this.right.subst(name, exp))
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

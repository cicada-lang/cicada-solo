import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../check"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Inr extends Exp {
  right: Exp

  constructor(right: Exp) {
    super()
    this.right = right
  }

  check(ctx: Ctx, t: Value): Core {
    const either = expect(ctx, t, Cores.EitherValue)
    const right_core = check(ctx, this.right, either.right_t)

    return new Cores.Inr(right_core)
  }

  repr(): string {
    const args = [this.right.repr()].join(", ")

    return `inl(${args})`
  }
}

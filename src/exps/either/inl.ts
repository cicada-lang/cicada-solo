import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Value } from "../../value"
import { check } from "../../check"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Inl extends Exp {
  left: Exp

  constructor(left: Exp) {
    super()
    this.left = left
  }

  check(ctx: Ctx, t: Value): Core {
    const either = expect(ctx, t, Cores.EitherValue)
    const left_core = check(ctx, this.left, either.left_t)

    return new Cores.Inl(left_core)
  }

  repr(): string {
    const args = [this.left.repr()].join(", ")

    return `inl(${args})`
  }
}

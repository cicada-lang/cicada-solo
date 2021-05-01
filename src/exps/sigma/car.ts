import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import * as Cores from "../../cores"

export class Car extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  infer(ctx: Ctx): { t: Value; exp: Core } {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, Cores.SigmaValue)
    return sigma.car_t
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }
}

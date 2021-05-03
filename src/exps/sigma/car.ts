import { Exp } from "../../exp"
import { Core } from "../../core"
import { Ctx } from "../../ctx"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Car extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  infer(ctx: Ctx): { t: Value; core: Core } {
    const inferred_target = infer(ctx, this.target)
    const sigma = expect(ctx, inferred_target.t, Cores.SigmaValue)
    const t = sigma.car_t
    const core = new Cores.Car(inferred_target.core)
    return { t, core }
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }
}

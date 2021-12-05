import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class ConsCore extends Core {
  car: Core
  cdr: Core

  constructor(car: Core, cdr: Core) {
    super()
    this.car = car
    this.cdr = cdr
  }

  evaluate(env: Env): Value {
    return new Exps.ConsValue(evaluate(env, this.car), evaluate(env, this.cdr))
  }

  format(): string {
    return `[${this.car.format()} | ${this.cdr.format()}]`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `[${this.car.alpha_format(ctx)} | ${this.cdr.alpha_format(ctx)}]`
  }
}

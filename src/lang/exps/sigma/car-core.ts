import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class CarCore extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return CarCore.apply(evaluate(env, this.target))
  }

  format(): string {
    return `car(${this.target.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `car(${this.target.alpha_format(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Exps.ConsValue) {
      return target.car
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ConsValue],
      })
    }

    if (!(target.t instanceof Exps.SigmaValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.SigmaValue],
      })
    }

    return new Exps.NotYetValue(
      target.t.car_t,
      new Exps.CarNeutral(target.neutral)
    )
  }
}

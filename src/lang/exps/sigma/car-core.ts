import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class CarCore extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return CarCore.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `car(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Exps.ConsValue) {
      return target.car
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.SigmaValue) {
        return new Exps.NotYetValue(t.car_t, new Exps.CarNeutral(neutral))
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.SigmaValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ConsValue],
      })
    }
  }
}

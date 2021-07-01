import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"

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
    if (target instanceof Sem.ConsValue) {
      return target.car
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Sem.SigmaValue) {
        return new Sem.NotYetValue(t.car_t, new Sem.CarNeutral(neutral))
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.SigmaValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.ConsValue],
      })
    }
  }
}

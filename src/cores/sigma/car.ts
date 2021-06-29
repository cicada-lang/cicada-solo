import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../evaluate"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"

export class Car extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return Car.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `car(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Cores.ConsValue) {
      return target.car
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Cores.SigmaValue) {
        return new Cores.NotYetValue(t.car_t, new Cores.CarNeutral(neutral))
      } else {
        throw new InternalError(
          [
            `I expect the type of the neutral to be an instance of SigmaValue`,
            `but the constructor name I meet is: ${t.constructor.name}`,
          ].join("\n") + "\n"
        )
      }
    } else {
      throw new InternalError(
        [
          `I expect the target to be an instance of ConsValue`,
          `but the constructor name I meet is: ${target.constructor.name}`,
        ].join("\n") + "\n"
      )
    }
  }
}

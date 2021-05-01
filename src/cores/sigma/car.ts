import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
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
    return match_value(target, [
      [Cores.ConsValue, (cons: Cores.ConsValue) => cons.car],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.SigmaValue,
              (sigma: Cores.SigmaValue) =>
                new Cores.NotYetValue(
                  sigma.car_t,
                  new Cores.CarNeutral(neutral)
                ),
            ],
          ]),
      ],
    ])
  }
}

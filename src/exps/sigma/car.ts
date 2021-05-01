import { Exp } from "../../exp"
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

  evaluate(ctx: Ctx, env: Env): Value {
    return Car.apply(evaluate(ctx, env, this.target))
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, Cores.SigmaValue)
    return sigma.car_t
  }

  repr(): string {
    return `car(${this.target.repr()})`
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

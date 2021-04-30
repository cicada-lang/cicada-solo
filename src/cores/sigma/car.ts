import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import { Trace } from "../../trace"
import { NotYetValue } from "../../cores"
import { SigmaValue, ConsValue, CarNeutral } from "../../cores"

export class Car extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Car.apply(evaluate(ctx, env, this.target))
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `car(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    return match_value(target, [
      [ConsValue, (cons: ConsValue) => cons.car],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              SigmaValue,
              (sigma: SigmaValue) =>
                new NotYetValue(sigma.car_t, new CarNeutral(neutral)),
            ],
          ]),
      ],
    ])
  }
}

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

export class Car implements Core {
  target: Core

  constructor(target: Core) {
    this.target = target
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Car.apply(evaluate(ctx, env, this.target))
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, SigmaValue)
    return sigma.car_t
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

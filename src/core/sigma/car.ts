import { Exp, AlphaCtx } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value, match_value } from "../../value"
import { evaluate } from "../../evaluate"
import { Trace } from "../../trace"
import { NotYetValue } from "../../core"
import { SigmaValue, ConsValue, CarNeutral } from "../../core"

export class Car implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value {
    return Car.apply(evaluate(env, this.target))
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
}

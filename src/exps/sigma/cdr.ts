import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import { Car } from "../../exps"
import { SigmaValue, ConsValue, CdrNeutral } from "../../cores"
import { NotYetValue } from "../../cores"

export class Cdr extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  evaluate(ctx: Ctx, env: Env): Value {
    return Cdr.apply(evaluate(ctx, env, this.target))
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, SigmaValue)
    const car = Car.apply(evaluate(ctx, ctx.to_env(), this.target))
    return sigma.cdr_t_cl.apply(car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  static apply(target: Value): Value {
    return match_value(target, [
      [ConsValue, (cons: ConsValue) => cons.cdr],
      [
        NotYetValue,
        ({ t, neutral }: NotYetValue) =>
          match_value(t, [
            [
              SigmaValue,
              (sigma: SigmaValue) =>
                new NotYetValue(
                  sigma.cdr_t_cl.apply(Car.apply(target)),
                  new CdrNeutral(neutral)
                ),
            ],
          ]),
      ],
    ])
  }
}

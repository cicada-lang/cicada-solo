import { Exp } from "../../exp"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { evaluate } from "../../evaluate"
import { Value, match_value } from "../../value"
import * as Exps from "../../exps"
import * as Cores from "../../cores"

export class Cdr extends Exp {
  target: Exp

  constructor(target: Exp) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return Cores.Cdr.apply(evaluate(env, this.target))
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, Cores.SigmaValue)
    const car = Cores.Car.apply(evaluate(ctx.to_env(), this.target))
    return sigma.cdr_t_cl.apply(car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  static apply(target: Value): Value {
    return match_value(target, [
      [Cores.ConsValue, (cons: Cores.ConsValue) => cons.cdr],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          match_value(t, [
            [
              Cores.SigmaValue,
              (sigma: Cores.SigmaValue) =>
                new Cores.NotYetValue(
                  sigma.cdr_t_cl.apply(Cores.Car.apply(target)),
                  new Cores.CdrNeutral(neutral)
                ),
            ],
          ]),
      ],
    ])
  }
}

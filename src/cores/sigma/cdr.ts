import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { Value } from "../../value"
import * as Cores from "../../cores"

export class Cdr extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return Cdr.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cdr(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    return Value.match(target, [
      [Cores.ConsValue, (cons: Cores.ConsValue) => cons.cdr],
      [
        Cores.NotYetValue,
        ({ t, neutral }: Cores.NotYetValue) =>
          Value.match(t, [
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

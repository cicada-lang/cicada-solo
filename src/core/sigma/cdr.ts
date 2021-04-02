import { Exp, AlphaCtx } from "@/exp"
import { Ctx } from "@/ctx"
import { Env } from "@/env"
import { infer } from "@/infer"
import { expect } from "@/expect"
import { evaluate } from "@/evaluate"
import { Value, match_value } from "@/value"
import { Closure } from "@/closure"
import { Trace } from "@/trace"
import { Car, SigmaValue, ConsValue, CdrNeutral } from "@/core"
import { NotYetValue } from "@/core"

export class Cdr implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value {
    return Cdr.apply(evaluate(env, this.target))
  }

  static apply(target: Value): Value {
    return match_value(target, {
      ConsValue: (cons: ConsValue) => cons.cdr,
      NotYetValue: ({ t, neutral }: NotYetValue) =>
        match_value(t, {
          SigmaValue: (sigma: SigmaValue) =>
            new NotYetValue(
              sigma.cdr_t_cl.apply(Car.apply(target)),
              new CdrNeutral(neutral)
            ),
        }),
    })
  }

  infer(ctx: Ctx): Value {
    const target_t = infer(ctx, this.target)
    const sigma = expect(ctx, target_t, SigmaValue)
    const car = Car.apply(evaluate(ctx.to_env(), this.target))
    return sigma.cdr_t_cl.apply(car)
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cdr(${this.target.alpha_repr(ctx)})`
  }
}

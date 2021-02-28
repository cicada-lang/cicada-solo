import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { infer } from "../infer"
import { expect } from "../expect"
import { evaluate } from "../evaluate"
import { Value } from "../value"
import { Closure } from "../closure"
import * as Explain from "../explain"
import { Trace } from "../trace"
import { Car, SigmaValue, ConsValue, CdrNeutral } from "../core"
import { NotYetValue } from "../core"

export class Cdr implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value {
    return Cdr.apply(evaluate(env, this.target))
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

  static apply(target: Value): Value {
    if (target instanceof ConsValue) {
      return target.cdr
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof SigmaValue) {
        return new NotYetValue(
          target.t.cdr_t_cl.apply(Car.apply(target)),
          new CdrNeutral(target.neutral)
        )
      } else {
        throw new Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "cdr",
            expecting: ["Value.sigma"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace(
        Explain.explain_elim_target_mismatch({
          elim: "cdr",
          expecting: ["Value.cons", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}

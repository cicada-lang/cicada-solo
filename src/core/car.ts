import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { infer } from "../infer"
import { expect } from "../expect"
import { Value } from "../value"
import { evaluate } from "../evaluate"
import * as Explain from "../explain"
import { Trace } from "../trace"
import { NotYetValue } from "../core"
import { SigmaValue, ConsValue, CarNeutral } from "../core"

export class Car implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value {
    return Car.apply(evaluate(env, this.target))
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
    if (target instanceof ConsValue) {
      return target.car
    } else if (target instanceof NotYetValue) {
      if (target.t instanceof SigmaValue) {
        return new NotYetValue(target.t.car_t, new CarNeutral(target.neutral))
      } else {
        throw new Trace(
          Explain.explain_elim_target_type_mismatch({
            elim: "car",
            expecting: ["Value.sigma"],
            reality: target.t.constructor.name,
          })
        )
      }
    } else {
      throw new Trace(
        Explain.explain_elim_target_mismatch({
          elim: "car",
          expecting: ["Value.cons", "new NotYetValue"],
          reality: target.constructor.name,
        })
      )
    }
  }
}

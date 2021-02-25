import { Exp, AlphaCtx } from "../exp"
import { Ctx } from "../ctx"
import { Env } from "../env"
import { infer } from "../infer"
import * as Value from "../value"
import { evaluate } from "../evaluate"
import * as Explain from "../explain"
import * as Neutral from "../neutral"
import * as Trace from "../trace"
import { NotYetValue } from "./not-yet-value"
import { SigmaValue } from "./sigma-value"
import { ConsValue } from "./cons-value"

export class Car implements Exp {
  target: Exp

  constructor(target: Exp) {
    this.target = target
  }

  evaluate(env: Env): Value.Value {
    return do_car(evaluate(env, this.target))
  }

  infer(ctx: Ctx): Value.Value {
    const target_t = infer(ctx, this.target)
    const sigma = Value.is_sigma(ctx, target_t)
    return sigma.car_t
  }

  repr(): string {
    return `car(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `car(${this.target.alpha_repr(ctx)})`
  }
}

export function do_car(target: Value.Value): Value.Value {
  if (target instanceof ConsValue) {
    return target.car
  } else if (target instanceof NotYetValue) {
    if (target.t instanceof SigmaValue) {
      return Value.not_yet(target.t.car_t, Neutral.car(target.neutral))
    } else {
      throw new Trace.Trace(
        Explain.explain_elim_target_type_mismatch({
          elim: "car",
          expecting: ["Value.sigma"],
          reality: target.t.constructor.name,
        })
      )
    }
  } else {
    throw new Trace.Trace(
      Explain.explain_elim_target_mismatch({
        elim: "car",
        expecting: ["Value.cons", "Value.not_yet"],
        reality: target.constructor.name,
      })
    )
  }
}

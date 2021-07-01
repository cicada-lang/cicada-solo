import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { InternalError } from "../../errors"
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
    if (target instanceof Cores.ConsValue) {
      return target.cdr
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Cores.SigmaValue) {
        return new Cores.NotYetValue(
          t.cdr_t_cl.apply(Cores.Car.apply(target)),
          new Cores.CdrNeutral(neutral)
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Cores.SigmaValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, { expected: [Cores.ConsValue] })
    }
  }
}

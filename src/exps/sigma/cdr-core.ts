import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class CdrCore extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return CdrCore.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `cdr(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `cdr(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Exps.ConsValue) {
      return target.cdr
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.SigmaValue) {
        return new Exps.NotYetValue(
          t.cdr_t_cl.apply(Exps.CarCore.apply(target)),
          new Exps.CdrNeutral(neutral)
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.SigmaValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, { expected: [Exps.ConsValue] })
    }
  }
}

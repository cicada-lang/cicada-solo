import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

export class AbsurdIndCore extends Core {
  target: Core
  motive: Core

  constructor(target: Core, motive: Core) {
    super()
    this.target = target
    this.motive = motive
  }

  evaluate(env: Env): Value {
    return AbsurdIndCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive)
    )
  }

  repr(): string {
    return `absurd_ind(${this.target.repr()}, ${this.motive.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `absurd_ind(${this.target.alpha_repr(ctx)}, ${this.motive.alpha_repr(
      ctx
    )})`
  }

  static apply(target: Value, motive: Value): Value {
    if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Exps.AbsurdValue) {
        return new Exps.NotYetValue(
          motive,
          new Exps.AbsurdIndNeutral(
            neutral,
            new Normal(new Exps.TypeValue(), motive)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.AbsurdValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.NotYetValue],
      })
    }
  }
}

import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../evaluate"
import { Env } from "../../env"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"

export class AbsurdInd extends Core {
  target: Core
  motive: Core

  constructor(target: Core, motive: Core) {
    super()
    this.target = target
    this.motive = motive
  }

  evaluate(env: Env): Value {
    return AbsurdInd.apply(
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
    if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Cores.AbsurdValue) {
        return new Cores.NotYetValue(
          motive,
          new Cores.AbsurdIndNeutral(
            neutral,
            new Normal(new Cores.TypeValue(), motive)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Cores.AbsurdValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Cores.NotYetValue],
      })
    }
  }
}

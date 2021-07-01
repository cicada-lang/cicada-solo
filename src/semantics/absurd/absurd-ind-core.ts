import { Core, AlphaCtx } from "../../core"
import { evaluate } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"

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
    if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target
      if (t instanceof Sem.AbsurdValue) {
        return new Sem.NotYetValue(
          motive,
          new Sem.AbsurdIndNeutral(
            neutral,
            new Normal(new Sem.TypeValue(), motive)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.AbsurdValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.NotYetValue],
      })
    }
  }
}

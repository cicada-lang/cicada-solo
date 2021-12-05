import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"

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

  format(): string {
    const target = this.target.format()
    const motive = this.motive.format()
    return `absurd_ind(${target}, ${motive})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const target = this.target.alpha_format(ctx)
    const motive = this.motive.alpha_format(ctx)
    return `absurd_ind(${target}, ${motive})`
  }

  static apply(target: Value, motive: Value): Value {
    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.NotYetValue],
      })
    }

    if (!(target.t instanceof Exps.AbsurdValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.AbsurdValue],
      })
    }

    return new Exps.NotYetValue(
      motive,
      new Exps.AbsurdIndNeutral(
        target.neutral,
        new Normal(new Exps.TypeValue(), motive)
      )
    )
  }
}

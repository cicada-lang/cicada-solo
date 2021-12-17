import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { Closure } from "../closure"

export class ReplaceCore extends Core {
  target: Core
  motive: Core
  base: Core

  constructor(target: Core, motive: Core, base: Core) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
  }

  evaluate(env: Env): Value {
    return ReplaceCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base)
    )
  }

  format(): string {
    const args = [
      this.target.format(),
      this.motive.format(),
      this.base.format(),
    ].join(", ")

    return `replace(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_format(ctx),
      this.motive.alpha_format(ctx),
      this.base.alpha_format(ctx),
    ].join(", ")

    return `replace(${args})`
  }

  static apply(target: Value, motive: Value, base: Value): Value {
    if (target instanceof Exps.ReflValue) {
      return base
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ReflValue],
      })
    }

    if (!(target.t instanceof Exps.EqualValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.EqualValue],
      })
    }

    const base_t = Exps.ApCore.apply(motive, target.t.from)
    const motive_t = new Exps.PiValue(
      target.t.t,
      new Closure(Env.init(), "x", new Exps.BuiltInCore("Type"))
    )
    return new Exps.NotYetValue(
      Exps.ApCore.apply(motive, target.t.to),
      new Exps.ReplaceNeutral(
        target.neutral,
        new Normal(motive_t, motive),
        new Normal(base_t, base)
      )
    )
  }
}

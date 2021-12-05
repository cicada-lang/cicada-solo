import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { nat_ind_motive_t, nat_ind_step_t } from "./nat-ind"

export class NatIndCore extends Core {
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(target: Core, motive: Core, base: Core, step: Core) {
    super()
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    return NatIndCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  format(): string {
    const args = [
      this.target.format(),
      this.motive.format(),
      this.base.format(),
      this.step.format(),
    ].join(", ")

    return `nat_ind(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_format(ctx),
      this.motive.alpha_format(ctx),
      this.base.alpha_format(ctx),
      this.step.alpha_format(ctx),
    ].join(", ")

    return `nat_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    if (target instanceof Exps.ZeroValue) {
      return base
    }

    if (target instanceof Exps.Add1Value) {
      return Exps.ApCore.apply_args(step, [
        target.prev,
        Exps.NatIndCore.apply(target.prev, motive, base, step),
      ])
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ZeroValue, Exps.Add1Value],
      })
    }

    if (!(target.t instanceof Exps.NatValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.NatValue],
      })
    }

    const motive_t = nat_ind_motive_t
    const base_t = Exps.ApCore.apply(motive, new Exps.ZeroValue())
    const step_t = nat_ind_step_t(motive)
    return new Exps.NotYetValue(
      Exps.ApCore.apply(motive, target),
      new Exps.NatIndNeutral(
        target.neutral,
        new Normal(motive_t, motive),
        new Normal(base_t, base),
        new Normal(step_t, step)
      )
    )
  }
}

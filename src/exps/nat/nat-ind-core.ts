import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
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

  repr(): string {
    const args = [
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `nat_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `nat_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    if (target instanceof Exps.ZeroValue) {
      return base
    } else if (target instanceof Exps.Add1Value) {
      const { prev } = target

      return Exps.ApCore.apply(
        Exps.ApCore.apply(step, prev),
        Exps.NatIndCore.apply(prev, motive, base, step)
      )
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Exps.NatValue) {
        const motive_t = nat_ind_motive_t
        const base_t = Exps.ApCore.apply(motive, new Exps.ZeroValue())
        const step_t = nat_ind_step_t(motive)
        return new Exps.NotYetValue(
          Exps.ApCore.apply(motive, target),
          new Exps.NatIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.NatValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.ZeroValue, Exps.Add1Value],
      })
    }
  }
}

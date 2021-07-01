import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"
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
    if (target instanceof Sem.ZeroValue) {
      return base
    } else if (target instanceof Sem.Add1Value) {
      const { prev } = target

      return Sem.ApCore.apply(
        Sem.ApCore.apply(step, prev),
        Sem.NatIndCore.apply(prev, motive, base, step)
      )
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.NatValue) {
        const motive_t = nat_ind_motive_t
        const base_t = Sem.ApCore.apply(motive, new Sem.ZeroValue())
        const step_t = nat_ind_step_t(motive)
        return new Sem.NotYetValue(
          Sem.ApCore.apply(motive, target),
          new Sem.NatIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.NatValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.ZeroValue, Sem.Add1Value],
      })
    }
  }
}

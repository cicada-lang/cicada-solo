import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { check } from "../../exp"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"
import { nat_ind_motive_t, nat_ind_step_t } from "./nat-ind"

export class NatInd extends Core {
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
    return NatInd.apply(
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

      return Sem.Ap.apply(
        Sem.Ap.apply(step, prev),
        Sem.NatInd.apply(prev, motive, base, step)
      )
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.NatValue) {
        const motive_t = nat_ind_motive_t
        const base_t = Sem.Ap.apply(motive, new Sem.ZeroValue())
        const step_t = nat_ind_step_t(motive)
        return new Sem.NotYetValue(
          Sem.Ap.apply(motive, target),
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

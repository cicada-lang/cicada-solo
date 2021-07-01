import { Core, AlphaCtx } from "../../core"
import { Ctx } from "../../ctx"
import { Env } from "../../env"
import { evaluate } from "../../evaluate"
import { check } from "../../check"
import { infer } from "../../infer"
import { expect } from "../../expect"
import { Value } from "../../value"
import { Closure } from "../../closure"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"
import { list_ind_motive_t, list_ind_step_t } from "../../exps/list/list-ind"

export class ListInd extends Core {
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
    return ListInd.apply(
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

    return `list_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
    ].join(", ")

    return `list_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    if (target instanceof Cores.NilValue) {
      return base
    } else if (target instanceof Cores.LiValue) {
      const { head, tail } = target

      return Cores.Ap.apply(
        Cores.Ap.apply(Cores.Ap.apply(step, head), tail),
        Cores.ListInd.apply(tail, motive, base, step)
      )
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Cores.ListValue) {
        const elem_t = t.elem_t
        const motive_t = list_ind_motive_t(elem_t)
        const base_t = Cores.Ap.apply(motive, new Cores.NilValue())
        const step_t = list_ind_step_t(motive, elem_t)
        return new Cores.NotYetValue(
          Cores.Ap.apply(motive, target),
          new Cores.ListIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Cores.ListValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Cores.NilValue, Cores.LiValue],
      })
    }
  }
}

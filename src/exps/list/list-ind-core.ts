import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { list_ind_motive_t, list_ind_step_t } from "./list-ind"

export class ListIndCore extends Core {
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
    return ListIndCore.apply(
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
    if (target instanceof Exps.NilValue) {
      return base
    } else if (target instanceof Exps.LiValue) {
      const { head, tail } = target

      return Exps.ApCore.apply(
        Exps.ApCore.apply(Exps.ApCore.apply(step, head), tail),
        Exps.ListIndCore.apply(tail, motive, base, step)
      )
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Exps.ListValue) {
        const elem_t = t.elem_t
        const motive_t = list_ind_motive_t(elem_t)
        const base_t = Exps.ApCore.apply(motive, new Exps.NilValue())
        const step_t = list_ind_step_t(motive, elem_t)
        return new Exps.NotYetValue(
          Exps.ApCore.apply(motive, target),
          new Exps.ListIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.ListValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.NilValue, Exps.LiValue],
      })
    }
  }
}

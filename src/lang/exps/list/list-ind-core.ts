import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
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

  format(): string {
    const args = [
      this.target.format(),
      this.motive.format(),
      this.base.format(),
      this.step.format(),
    ].join(", ")

    return `list_ind(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_format(ctx),
      this.motive.alpha_format(ctx),
      this.base.alpha_format(ctx),
      this.step.alpha_format(ctx),
    ].join(", ")

    return `list_ind(${args})`
  }

  static apply(target: Value, motive: Value, base: Value, step: Value): Value {
    if (target instanceof Exps.NilValue) {
      return base
    }

    if (target instanceof Exps.LiValue) {
      return Exps.ApCore.apply(
        Exps.ApCore.apply(Exps.ApCore.apply(step, target.head), target.tail),
        Exps.ListIndCore.apply(target.tail, motive, base, step)
      )
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.NilValue, Exps.LiValue],
      })
    }

    if (!(target.t instanceof Exps.ListValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.ListValue],
      })
    }

    const elem_t = target.t.elem_t
    const motive_t = list_ind_motive_t(elem_t)
    const base_t = Exps.ApCore.apply(motive, new Exps.NilValue())
    const step_t = list_ind_step_t(motive, elem_t)
    return new Exps.NotYetValue(
      Exps.ApCore.apply(motive, target),
      new Exps.ListIndNeutral(
        target.neutral,
        new Normal(motive_t, motive),
        new Normal(base_t, base),
        new Normal(step_t, step)
      )
    )
  }
}

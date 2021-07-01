import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"
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
    if (target instanceof Sem.NilValue) {
      return base
    } else if (target instanceof Sem.LiValue) {
      const { head, tail } = target

      return Sem.ApCore.apply(
        Sem.ApCore.apply(Sem.ApCore.apply(step, head), tail),
        Sem.ListIndCore.apply(tail, motive, base, step)
      )
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.ListValue) {
        const elem_t = t.elem_t
        const motive_t = list_ind_motive_t(elem_t)
        const base_t = Sem.ApCore.apply(motive, new Sem.NilValue())
        const step_t = list_ind_step_t(motive, elem_t)
        return new Sem.NotYetValue(
          Sem.ApCore.apply(motive, target),
          new Sem.ListIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.ListValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.NilValue, Sem.LiValue],
      })
    }
  }
}

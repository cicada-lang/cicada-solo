import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import {
  either_ind_motive_t,
  either_ind_base_left_t,
  either_ind_base_right_t,
} from "./either-ind"

export class EitherIndCore extends Core {
  target: Core
  motive: Core
  base_left: Core
  base_right: Core

  constructor(target: Core, motive: Core, base_left: Core, base_right: Core) {
    super()
    this.target = target
    this.motive = motive
    this.base_left = base_left
    this.base_right = base_right
  }

  evaluate(env: Env): Value {
    return EitherIndCore.apply(
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base_left),
      evaluate(env, this.base_right)
    )
  }

  format(): string {
    const args = [
      this.target.format(),
      this.motive.format(),
      this.base_left.format(),
      this.base_right.format(),
    ].join(", ")

    return `either_ind(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.target.alpha_format(ctx),
      this.motive.alpha_format(ctx),
      this.base_left.alpha_format(ctx),
      this.base_right.alpha_format(ctx),
    ].join(", ")

    return `either_ind(${args})`
  }

  static apply(
    target: Value,
    motive: Value,
    base_left: Value,
    base_right: Value
  ): Value {
    if (target instanceof Exps.InlValue) {
      return Exps.ApCore.apply(base_left, target.left)
    } else if (target instanceof Exps.InrValue) {
      return Exps.ApCore.apply(base_right, target.right)
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Exps.EitherValue) {
        const motive_t = either_ind_motive_t(t)
        const base_left_t = either_ind_base_left_t(t.left_t, motive)
        const base_right_t = either_ind_base_right_t(t.right_t, motive)
        return new Exps.NotYetValue(
          Exps.ApCore.apply(motive, target),
          new Exps.EitherIndNeutral(
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_left_t, base_left),
            new Normal(base_right_t, base_right)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.EitherValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.InlValue, Exps.InrValue],
      })
    }
  }
}

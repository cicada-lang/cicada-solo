import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Normal } from "../../normal"
import { Value } from "../../value"
import { vector_ind_motive_t, vector_ind_step_t } from "./vector-ind"

export class VectorIndCore extends Core {
  length: Core
  target: Core
  motive: Core
  base: Core
  step: Core

  constructor(
    length: Core,
    target: Core,
    motive: Core,
    base: Core,
    step: Core
  ) {
    super()
    this.length = length
    this.target = target
    this.motive = motive
    this.base = base
    this.step = step
  }

  evaluate(env: Env): Value {
    return VectorIndCore.apply(
      evaluate(env, this.length),
      evaluate(env, this.target),
      evaluate(env, this.motive),
      evaluate(env, this.base),
      evaluate(env, this.step)
    )
  }

  format(): string {
    const args = [
      this.length.format(),
      this.target.format(),
      this.motive.format(),
      this.base.format(),
      this.step.format(),
    ].join(", ")

    return `vector_ind(${args})`
  }

  alpha_format(ctx: AlphaCtx): string {
    const args = [
      this.length.alpha_format(ctx),
      this.target.alpha_format(ctx),
      this.motive.alpha_format(ctx),
      this.base.alpha_format(ctx),
      this.step.alpha_format(ctx),
    ].join(", ")

    return `vector_ind(${args})`
  }

  static apply(
    length: Value,
    target: Value,
    motive: Value,
    base: Value,
    step: Value
  ): Value {
    if (target instanceof Exps.VecnilValue) {
      return base
    }

    if (target instanceof Exps.VecValue) {
      if (!(length instanceof Exps.Add1Value)) {
        throw new InternalError(
          [
            `I expect the length to be Add1Value`,
            `  given class name: ${length.constructor.name}`,
          ].join("\n") + "\n"
        )
      }

      return Exps.apply_args(step, [
        length,
        target.head,
        target.tail,
        Exps.VectorIndCore.apply(length.prev, target.tail, motive, base, step),
      ])
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.VecnilValue, Exps.VecValue],
      })
    }

    if (!(target.t instanceof Exps.VectorValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.VectorValue],
      })
    }

    const elem_t = target.t.elem_t
    const length_t = new Exps.NatValue()
    const motive_t = vector_ind_motive_t(elem_t)
    const base_t = Exps.ApCore.apply(
      Exps.ApCore.apply(motive, new Exps.ZeroValue()),
      new Exps.VecnilValue()
    )
    const step_t = vector_ind_step_t(motive, elem_t)
    return new Exps.NotYetValue(
      Exps.ApCore.apply(Exps.ApCore.apply(motive, length), target),
      new Exps.VectorIndNeutral(
        new Normal(length_t, length),
        target.neutral,
        new Normal(motive_t, motive),
        new Normal(base_t, base),
        new Normal(step_t, step)
      )
    )
  }
}

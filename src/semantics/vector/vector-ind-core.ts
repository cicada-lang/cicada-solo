import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { evaluate } from "../../core"
import { Value } from "../../value"
import { Normal } from "../../normal"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"
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

  repr(): string {
    const args = [
      this.length.repr(),
      this.target.repr(),
      this.motive.repr(),
      this.base.repr(),
      this.step.repr(),
    ].join(", ")

    return `vector_ind(${args})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    const args = [
      this.length.alpha_repr(ctx),
      this.target.alpha_repr(ctx),
      this.motive.alpha_repr(ctx),
      this.base.alpha_repr(ctx),
      this.step.alpha_repr(ctx),
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
    if (target instanceof Sem.VecnilValue) {
      return base
    } else if (target instanceof Sem.VecValue) {
      const { head, tail } = target

      if (length instanceof Sem.Add1Value) {
        return Sem.ApCore.apply(
          Sem.ApCore.apply(
            Sem.ApCore.apply(Sem.ApCore.apply(step, length), head),
            tail
          ),
          Sem.VectorIndCore.apply(length.prev, tail, motive, base, step)
        )
      } else {
        throw new InternalError(
          [
            `To apply vector_ind`,
            `I expect the length to be Add1Value`,
            `but the given class name is: ${length.constructor.name}`,
          ].join("\n") + "\n"
        )
      }
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.VectorValue) {
        const elem_t = t.elem_t
        const length_t = new Sem.NatValue()
        const motive_t = vector_ind_motive_t(elem_t)
        const base_t = Sem.ApCore.apply(
          Sem.ApCore.apply(motive, new Sem.ZeroValue()),
          new Sem.VecnilValue()
        )
        const step_t = vector_ind_step_t(motive, elem_t)
        return new Sem.NotYetValue(
          Sem.ApCore.apply(Sem.ApCore.apply(motive, length), target),
          new Sem.VectorIndNeutral(
            new Normal(length_t, length),
            neutral,
            new Normal(motive_t, motive),
            new Normal(base_t, base),
            new Normal(step_t, step)
          )
        )
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Sem.VectorValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.VecnilValue, Sem.VecValue],
      })
    }
  }
}

import { AlphaCtx, Core, evaluate } from "../../core"
import { Env } from "../../env"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"
import { Value } from "../../value"

export class VectorHeadCore extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return VectorHeadCore.apply(evaluate(env, this.target))
  }

  format(): string {
    return `vector_head(${this.target.format()})`
  }

  alpha_format(ctx: AlphaCtx): string {
    return `vector_head(${this.target.alpha_format(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Exps.VecValue) {
      return target.head
    }

    if (!(target instanceof Exps.NotYetValue)) {
      throw InternalError.wrong_target(target, {
        expected: [Exps.VecValue],
      })
    }

    if (!(target.t instanceof Exps.VectorValue)) {
      throw InternalError.wrong_target_t(target.t, {
        expected: [Exps.VectorValue],
      })
    }

    if (!(target.t.length instanceof Exps.Add1Value)) {
      throw new InternalError(
        [
          `To apply vector_head`,
          `I expect length of vector to be an instance of Add1Value`,
          `  given class name: ${target.t.length.constructor.name}`,
        ].join("\n") + "\n"
      )
    }

    return new Exps.NotYetValue(
      target.t.elem_t,
      new Exps.VectorHeadNeutral(target.neutral)
    )
  }
}

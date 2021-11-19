import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { Solution } from "../../solution"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Exps from "../../exps"

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
    } else if (target instanceof Exps.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Exps.VectorValue) {
        if (t.length instanceof Exps.Add1Value) {
          return new Exps.NotYetValue(
            t.elem_t,
            new Exps.VectorHeadNeutral(neutral)
          )
        } else {
          throw new InternalError(
            [
              `To apply vector_head`,
              `I expect length of vector to be an instance of Add1Value`,
              `but the given class name is: ${t.length.constructor.name}`,
            ].join("\n") + "\n"
          )
        }
      } else {
        throw InternalError.wrong_target_t(target.t, {
          expected: [Exps.VectorValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Exps.VecValue],
      })
    }
  }
}

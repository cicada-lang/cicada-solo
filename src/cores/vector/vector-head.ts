import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"

export class VectorHead extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return VectorHead.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `vector_head(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `vector_head(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Cores.VecValue) {
      return target.head
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Cores.VectorValue) {
        if (t.length instanceof Cores.Add1Value) {
          return new Cores.NotYetValue(
            t.elem_t,
            new Cores.VectorHeadNeutral(neutral)
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
          expected: [Cores.VectorValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Cores.VecValue],
      })
    }
  }
}

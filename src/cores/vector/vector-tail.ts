import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../exp"
import { InternalError } from "../../errors"
import * as Cores from "../../cores"

export class VectorTail extends Core {
  target: Core

  constructor(target: Core) {
    super()
    this.target = target
  }

  evaluate(env: Env): Value {
    return VectorTail.apply(evaluate(env, this.target))
  }

  repr(): string {
    return `vector_tail(${this.target.repr()})`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `vector_tail(${this.target.alpha_repr(ctx)})`
  }

  static apply(target: Value): Value {
    if (target instanceof Cores.VecValue) {
      return target.tail
    } else if (target instanceof Cores.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Cores.VectorValue) {
        if (t.length instanceof Cores.Add1Value) {
          return new Cores.NotYetValue(
            new Cores.VectorValue(t.elem_t, t.length.prev),
            new Cores.VectorTailNeutral(neutral)
          )
        } else {
          throw new InternalError(
            [
              `To apply vector_tail`,
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

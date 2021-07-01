import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"

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
    if (target instanceof Sem.VecValue) {
      return target.head
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.VectorValue) {
        if (t.length instanceof Sem.Add1Value) {
          return new Sem.NotYetValue(
            t.elem_t,
            new Sem.VectorHeadNeutral(neutral)
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
          expected: [Sem.VectorValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.VecValue],
      })
    }
  }
}

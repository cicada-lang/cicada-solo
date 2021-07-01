import { Core, AlphaCtx } from "../../core"
import { Env } from "../../env"
import { Value } from "../../value"
import { evaluate } from "../../core"
import { InternalError } from "../../errors"
import * as Sem from "../../sem"

export class DotCore extends Core {
  target: Core
  name: string

  constructor(target: Core, name: string) {
    super()
    this.target = target
    this.name = name
  }

  evaluate(env: Env): Value {
    return Sem.DotCore.apply(evaluate(env, this.target), this.name)
  }

  repr(): string {
    return `${this.target.repr()}.${this.name}`
  }

  alpha_repr(ctx: AlphaCtx): string {
    return `${this.target.alpha_repr(ctx)}.${this.name}`
  }

  static apply(target: Value, name: string): Value {
    if (target instanceof Sem.ObjValue) {
      return target.dot_value(name)
    } else if (target instanceof Sem.NotYetValue) {
      const { t, neutral } = target

      if (t instanceof Sem.ClsValue) {
        return new Sem.NotYetValue(
          t.dot_type(target, name),
          new Sem.DotNeutral(neutral, name)
        )
      } else {
        throw InternalError.wrong_target_t(t, {
          expected: [Sem.ClsNilValue, Sem.ClsConsValue],
        })
      }
    } else {
      throw InternalError.wrong_target(target, {
        expected: [Sem.ObjValue],
      })
    }
  }
}
